/**
 * API Route: Payment Verification
 * Verifies PayU payment response and updates payment status
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { APIBook } from '@/lib/firebase/services';
import { PaymentStatus } from '@/lib/payment/payu-config';

/**
 * Generate hash for PayU response verification
 * Format: salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 */
function generateResponseHash(responseData: Record<string, string>): string {
  const merchantSalt = process.env.PAYU_MERCHANT_SALT;
  
  if (!merchantSalt) {
    throw new Error('Merchant salt not configured');
  }
  
  const hashString = [
    merchantSalt,
    responseData.status || '',
    '', '', '', '', '',
    responseData.udf5 || '',
    responseData.udf4 || '',
    responseData.udf3 || '',
    responseData.udf2 || '',
    responseData.udf1 || '',
    responseData.email || '',
    responseData.firstname || '',
    responseData.productinfo || '',
    responseData.amount || '',
    responseData.txnid || '',
    responseData.key || ''
  ].join('|');
  
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * Verify payment with PayU server
 */
async function verifyWithPayU(txnId: string): Promise<{ verified: boolean; data: unknown }> {
  try {
    const merchantKey = process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY;
    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    
    if (!merchantKey || !merchantSalt) {
      throw new Error('PayU configuration not found');
    }
    
    const command = 'verify_payment';
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://secure.payu.in' 
      : 'https://sandboxsecure.payu.in';
    
    // Create hash for verification
    const hashString = `${merchantKey}|${command}|${txnId}|${merchantSalt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    // Prepare request data
    const requestData = {
      key: merchantKey,
      command,
      var1: txnId,
      hash
    };
    
    // Make POST request to PayU verify API
    const response = await fetch(`${baseUrl}/merchant/postservice?form=2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(requestData).toString()
    });
    
    const data = await response.json();
    return {
      verified: data.status === 'success' && data.transaction_details?.[txnId]?.status === 'success',
      data
    };
  } catch (error) {
    console.error('PayU verification error:', error);
    return { verified: false, data: null };
  }
}

export async function POST(request: NextRequest) {
  try {
    const responseData = await request.json();
    const { txnid, status, hash } = responseData;
    
    if (!txnid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Transaction ID is required' 
      }, { status: 400 });
    }
    
    // Verify hash if present
    if (hash) {
      const calculatedHash = generateResponseHash(responseData);
      if (hash !== calculatedHash) {
        console.error('Hash verification failed for transaction:', txnid);
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid payment signature' 
        }, { status: 400 });
      }
    }
    
    // Get payment record from Firestore
    const paymentResult = await APIBook.payment.getPaymentByTxnId(txnid);
    
    if (!paymentResult.success || !paymentResult.data) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment record not found' 
      }, { status: 404 });
    }
    
    // Determine payment status
    let paymentStatus: PaymentStatus;
    switch (status?.toLowerCase()) {
      case 'success':
        paymentStatus = PaymentStatus.SUCCESS;
        break;
      case 'failure':
      case 'failed':
        paymentStatus = PaymentStatus.FAILED;
        break;
      case 'cancel':
      case 'cancelled':
        paymentStatus = PaymentStatus.CANCELLED;
        break;
      default:
        paymentStatus = PaymentStatus.FAILED;
    }
    
    // Update payment status in Firestore
    const updateResult = await APIBook.payment.updatePaymentStatus(
      paymentResult.data.id!, 
      paymentStatus, 
      responseData
    );
    
    if (!updateResult.success) {
      console.error('Failed to update payment status:', updateResult.error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update payment status' 
      }, { status: 500 });
    }
    
    // For successful payments, optionally verify with PayU server
    if (paymentStatus === PaymentStatus.SUCCESS) {
      const verification = await verifyWithPayU(txnid);
      if (!verification.verified) {
        console.warn('PayU server verification failed for transaction:', txnid);
        // Optionally update status to failed if server verification fails
        // await APIBook.payment.updatePaymentStatus(paymentResult.data.id!, PaymentStatus.FAILED, verification.data);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment status updated successfully',
      data: {
        txnId: txnid,
        status: paymentStatus,
        paymentId: paymentResult.data.id
      }
    });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Payment verification failed' 
    }, { status: 500 });
  }
}

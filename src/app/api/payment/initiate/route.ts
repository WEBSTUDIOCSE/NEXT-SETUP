/**
 * API Route: Payment Initiation
 * Securely generates PayU payment parameters with hash
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { APIBook } from '@/lib/firebase/services';
import { PayuService } from '@/lib/payment/payu-service';
import { PaymentStatus, DEFAULT_CURRENCY } from '@/lib/payment/payu-config';

interface PaymentInitiationRequest {
  userId: string;
  amount: number;
  productInfo: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  paymentMethod?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentInitiationRequest = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.amount || !body.productInfo || !body.firstName || !body.email || !body.phone) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Validate amount
    if (body.amount <= 0 || body.amount > 1000000) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid amount. Must be between 1 and 1,000,000' 
      }, { status: 400 });
    }
    
    // Generate unique transaction ID
    const txnId = PayuService.generateTransactionId();
    
    // Create payment record in Firestore
    const paymentResult = await APIBook.payment.createPayment({
      userId: body.userId,
      txnId,
      amount: body.amount,
      currency: DEFAULT_CURRENCY,
      status: PaymentStatus.PENDING,
      productInfo: body.productInfo,
      paymentMethod: body.paymentMethod,
      metadata: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
        zipCode: body.zipCode,
      }
    });
    
    if (!paymentResult.success || !paymentResult.data) {
      return NextResponse.json({ 
        success: false, 
        error: paymentResult.error || 'Failed to create payment record' 
      }, { status: 500 });
    }
    
    // Get PayU configuration from environment variables
    const merchantKey = process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY;
    const merchantSalt = process.env.PAYU_MERCHANT_SALT;
    
    if (!merchantKey || !merchantSalt) {
      return NextResponse.json({ 
        success: false, 
        error: 'PayU configuration not found' 
      }, { status: 500 });
    }
    
    // Prepare URLs
    const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`;
    const successUrl = `${baseUrl}/payment/success`;
    const failureUrl = `${baseUrl}/payment/failure`;
    
    // Generate hash string as per PayU documentation
    // Standard format: key|txnid|amount|productinfo|firstname|email|||||||||||salt
    // With UDF: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    const hashString = [
      merchantKey,
      txnId,
      body.amount.toString(),
      body.productInfo,
      body.firstName,
      body.email,
      paymentResult.data.id, // Store Firestore payment ID as udf1
      '', '', '', '', // udf2-udf5 empty
      '', '', '', '', '', // 5 empty fields as per PayU spec
      merchantSalt
    ].join('|');
    
    // Generate SHA512 hash
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    // Get PayU base URL based on environment
    const payuBaseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://secure.payu.in' 
      : 'https://test.payu.in'; // Official PayU test environment URL
    
    // Return payment parameters for form submission
    return NextResponse.json({
      success: true,
      data: {
        key: merchantKey,
        txnid: txnId,
        amount: body.amount.toString(),
        productinfo: body.productInfo,
        firstname: body.firstName,
        lastname: body.lastName || '',
        email: body.email,
        phone: body.phone,
        surl: successUrl,
        furl: failureUrl,
        hash: hash,
        udf1: paymentResult.data.id,
        address1: body.address || '',
        city: body.city || '',
        state: body.state || '',
        country: body.country || 'India',
        zipcode: body.zipCode || '',
        pg: body.paymentMethod || '',
        enforce_paymethod: body.paymentMethod || '',
        baseUrl: payuBaseUrl
      }
    });
    
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Payment initialization failed' 
    }, { status: 500 });
  }
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PayuService } from '@/lib/payment/payu-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Home, ArrowRight, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface PaymentResponseData {
  txnId: string;
  status: string;
  amount: string;
  payuMoneyId?: string;
  productInfo: string;
  firstName: string;
  email: string;
  phone: string;
  error?: string;
  errorMessage?: string;
}

export default function PaymentSuccessContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponseData | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Process PayU callback parameters
  useEffect(() => {
    const processPayment = async () => {
      try {
        if (authLoading) return;
        
        // Redirect to login if not authenticated
        if (!user) {
          router.push('/login?message=Please sign in to view payment status');
          return;
        }
        
        // Parse PayU response from URL parameters
        const response = PayuService.parsePaymentResponse(searchParams);
        
        if (!response.txnid || !response.status) {
          setError('Invalid payment response received');
          setLoading(false);
          return;
        }
        
        // Set payment data
        const paymentResponseData: PaymentResponseData = {
          txnId: response.txnid,
          status: response.status,
          amount: response.amount || '0',
          payuMoneyId: response.payuMoneyId || response.mihpayid,
          productInfo: response.productinfo || '',
          firstName: response.firstname || '',
          email: response.email || '',
          phone: response.phone || '',
          error: response.error,
          errorMessage: response.error_Message || response.error,
        };
        
        setPaymentData(paymentResponseData);
        setPaymentVerified(response.status?.toLowerCase() === 'success');
        
        // Verify payment with backend API
        try {
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(response),
          });
          
          const verifyResult = await verifyResponse.json();
          
          if (!verifyResult.success) {
            console.warn('Payment verification failed:', verifyResult.error);
            // Still show the payment status based on PayU response
          }
        } catch (verifyError) {
          console.error('Payment verification error:', verifyError);
          // Continue to show payment status even if verification fails
        }
        
        setLoading(false);
        
      } catch (error) {
        console.error('Payment success page error:', error);
        setError('An error occurred while processing the payment response');
        setLoading(false);
      }
    };
    
    processPayment();
  }, [user, authLoading, router, searchParams]);
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Payment Processing Error
            </CardTitle>
            <CardDescription className="text-gray-600">
              {error}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/checkout">
                <ArrowRight className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (!paymentData) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-yellow-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-600">
              No Payment Data
            </CardTitle>
            <CardDescription className="text-gray-600">
              No payment information was found. This might be because the payment wasn&apos;t completed or the session expired.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/checkout">
                <ArrowRight className="w-4 h-4 mr-2" />
                Make Payment
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const isSuccess = paymentVerified;
  const isFailure = paymentData.status?.toLowerCase() === 'failure';
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className={`shadow-lg ${
        isSuccess ? 'border-green-200' : isFailure ? 'border-red-200' : 'border-yellow-200'
      }`}>
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isSuccess ? 'bg-green-100' : isFailure ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            {isSuccess ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className={`w-8 h-8 ${isFailure ? 'text-red-600' : 'text-yellow-600'}`} />
            )}
          </div>
          <CardTitle className={`text-3xl font-bold ${
            isSuccess ? 'text-green-600' : isFailure ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {isSuccess ? 'Payment Successful!' : isFailure ? 'Payment Failed' : 'Payment Pending'}
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            {isSuccess 
              ? 'Your payment has been processed successfully.'
              : isFailure 
              ? 'Your payment could not be processed.'
              : 'Your payment is being processed.'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Thank you for your payment! You will receive a confirmation email shortly.
              </AlertDescription>
            </Alert>
          )}
          
          {isFailure && paymentData.errorMessage && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Error:</strong> {paymentData.errorMessage}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 text-lg">Payment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Transaction ID:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded border text-xs">
                    {paymentData.txnId}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(paymentData.txnId)}
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Amount:</span>
                <p className="text-gray-900 font-semibold">₹{paymentData.amount}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p className={`font-semibold capitalize ${
                  isSuccess ? 'text-green-600' : isFailure ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {paymentData.status}
                </p>
              </div>
              
              {paymentData.payuMoneyId && (
                <div>
                  <span className="font-medium text-gray-700">PayU ID:</span>
                  <p className="text-gray-900 font-mono text-xs">{paymentData.payuMoneyId}</p>
                </div>
              )}
              
              {paymentData.productInfo && (
                <div>
                  <span className="font-medium text-gray-700">Product:</span>
                  <p className="text-gray-900">{paymentData.productInfo}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">Customer:</span>
                <p className="text-gray-900">{paymentData.firstName}</p>
                <p className="text-gray-600 text-xs">{paymentData.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
          {isFailure && (
            <Button asChild variant="destructive" className="w-full sm:w-auto">
              <Link href="/checkout">
                <ArrowRight className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
          )}
          
          <Button asChild variant={isFailure ? "outline" : "default"} className="w-full sm:w-auto">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          {isSuccess && (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/profile">
                View Profile
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

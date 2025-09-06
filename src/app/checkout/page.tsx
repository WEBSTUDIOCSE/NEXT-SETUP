'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PaymentForm from '@/components/payment/PaymentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Shield, Lock, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { CommonSkeleton } from '@/components/common/CommonSkeleton';

function CheckoutContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [productInfo, setProductInfo] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [allowCustomAmount, setAllowCustomAmount] = useState(true);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push('/login?message=Please sign in to make a payment');
      return;
    }
    
    // Get product info and amount from URL params if provided
    const productParam = searchParams.get('product');
    const amountParam = searchParams.get('amount');
    const customAmountParam = searchParams.get('allowCustomAmount');
    
    if (productParam) {
      setProductInfo(decodeURIComponent(productParam));
    }
    
    if (amountParam) {
      const parsedAmount = parseFloat(amountParam);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        setAmount(parsedAmount);
        setAllowCustomAmount(customAmountParam !== 'false');
      }
    }
    
    setLoading(false);
  }, [user, authLoading, router, searchParams]);
  
  const handlePaymentSuccess = (paymentId: string) => {
    // This won't be called directly as PayU redirects to success/failure pages
    console.log('Payment initiated:', paymentId);
  };
  
  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };
  
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CommonSkeleton />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Please sign in to access the checkout page.
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-center">
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Secure Checkout</h1>
            <p className="text-muted-foreground">Complete your payment safely</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <PaymentForm
              productInfo={productInfo}
              amount={amount}
              allowCustomAmount={allowCustomAmount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full"
            />
          </div>
          
          {/* Security Information Sidebar */}
          <div className="space-y-6">
            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="mr-2 h-5 w-5 text-green-600" />
                  Secure Payment
                </CardTitle>
                <CardDescription>
                  Your transaction is protected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">SSL Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      All data is encrypted with 256-bit SSL
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">PayU Gateway</h4>
                    <p className="text-sm text-muted-foreground">
                      Powered by trusted PayU payment gateway
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">PCI Compliant</h4>
                    <p className="text-sm text-muted-foreground">
                      Meets highest security standards
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Accepted Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accepted Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-2 border rounded">
                    <span>💳</span>
                    <span className="text-sm">Credit Card</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded">
                    <span>💳</span>
                    <span className="text-sm">Debit Card</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded">
                    <span>🏦</span>
                    <span className="text-sm">Net Banking</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded">
                    <span>📱</span>
                    <span className="text-sm">UPI</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded">
                    <span>👛</span>
                    <span className="text-sm">Wallets</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded">
                    <span>🔄</span>
                    <span className="text-sm">EMI</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Support Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Having trouble with your payment? Our support team is here to help.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong> support@yourapp.com
                  </p>
                  <p className="text-sm">
                    <strong>Phone:</strong> +91 1234567890
                  </p>
                  <p className="text-sm">
                    <strong>Hours:</strong> 24/7 Support
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Terms and Privacy */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          By proceeding with the payment, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CommonSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}

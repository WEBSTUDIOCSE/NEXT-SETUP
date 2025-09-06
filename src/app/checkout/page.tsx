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
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [productInfo, setProductInfo] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [allowCustomAmount, setAllowCustomAmount] = useState(true);
  
  useEffect(() => {
    // Early return if still loading auth
    if (authLoading) return;
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login?message=Please sign in to make a payment');
      return;
    }
    
    // Parse URL parameters
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
  }, [isAuthenticated, authLoading, router, searchParams]);
  
  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CommonSkeleton />
      </div>
    );
  }
  
  // Show login prompt if not authenticated
  if (!isAuthenticated) {
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
  
  // Payment handlers (simplified)
  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment initiated:', paymentId);
  };
  
  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };
  
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
          
          {/* Security & Payment Info Sidebar */}
          <div className="space-y-4">
            {/* Security Features */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Shield className="mr-2 h-5 w-5 text-green-600" />
                  Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span>PayU Gateway</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>PCI Compliant</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Methods */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 border rounded">💳 Cards</div>
                  <div className="text-center p-2 border rounded">🏦 Banking</div>
                  <div className="text-center p-2 border rounded">📱 UPI</div>
                  <div className="text-center p-2 border rounded">� Wallets</div>
                  <div className="text-center p-2 border rounded">� EMI</div>
                  <div className="text-center p-2 border rounded">� More</div>
                </div>
              </CardContent>
            </Card>
            
            {/* Support */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Support</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>📧 support@yourapp.com</p>
                <p>📞 +91 1234567890</p>
                <p>🕒 24/7 Available</p>
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

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PaymentForm from '@/components/payment/PaymentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 muted">Loading...</p>
        </div>
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
    // Payment initiated successfully
  };
  
  const handlePaymentError = (error: string) => {
    // Handle payment error
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
            <h1 className="heading">Secure Checkout</h1>
            <p className="muted">Complete your payment safely</p>
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

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

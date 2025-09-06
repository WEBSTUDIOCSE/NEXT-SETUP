'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  ShoppingCart, 
  Coffee, 
  Book, 
  Music, 
  Gamepad2,
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

// Sample products for testing
const sampleProducts = [
  {
    id: '1',
    name: 'Premium Coffee',
    description: 'Artisan roasted coffee beans',
    price: 299,
    icon: Coffee,
    category: 'Food & Beverage'
  },
  {
    id: '2',
    name: 'Digital Course',
    description: 'Complete web development course',
    price: 1999,
    icon: Book,
    category: 'Education'
  },
  {
    id: '3',
    name: 'Music Subscription',
    description: 'Premium music streaming for 1 month',
    price: 99,
    icon: Music,
    category: 'Entertainment'
  },
  {
    id: '4',
    name: 'Game Credits',
    description: 'In-game currency for mobile games',
    price: 500,
    icon: Gamepad2,
    category: 'Gaming'
  },
];

export default function PaymentTestPage() {
  const { user } = useAuth();

  const generateCheckoutUrl = (product: typeof sampleProducts[0]) => {
    const params = new URLSearchParams({
      product: product.description,
      amount: product.price.toString(),
      allowCustomAmount: 'false'
    });
    return `/checkout?${params.toString()}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please sign in to test the payment gateway.
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">PayU Gateway Test</h1>
          <p className="text-muted-foreground text-lg">
            Test the secure PayU payment integration
          </p>
          <Badge variant="secondary" className="mt-2">
            Sandbox Environment
          </Badge>
        </div>

        {/* User Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Test Dashboard
            </CardTitle>
            <CardDescription>
              Logged in as: {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This is a test environment. Use PayU&apos;s test card numbers for transactions.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="font-medium">Test Card Details:</h4>
              <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                <p><strong>Card Number:</strong> 5123456789012346</p>
                <p><strong>Expiry:</strong> 05/26</p>
                <p><strong>CVV:</strong> 123</p>
                <p><strong>Name:</strong> Test User</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sampleProducts.map((product) => {
            const Icon = product.icon;
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold">₹{product.price}</span>
                  </div>
                  <Badge variant="outline" className="w-full justify-center mb-4">
                    {product.category}
                  </Badge>
                  <Link href={generateCheckoutUrl(product)} className="block">
                    <Button className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Custom Amount Test */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Amount Payment</CardTitle>
            <CardDescription>
              Test with any amount you want to pay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/checkout">
              <Button size="lg" className="w-full">
                <CreditCard className="mr-2 h-5 w-5" />
                Test Custom Payment
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="default" className="mb-2">✅ Active</Badge>
                <h4 className="font-medium">PayU Gateway</h4>
                <p className="text-sm text-muted-foreground">Connected and ready</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="default" className="mb-2">✅ Active</Badge>
                <h4 className="font-medium">Firebase Database</h4>
                <p className="text-sm text-muted-foreground">Payment records synced</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="default" className="mb-2">✅ Active</Badge>
                <h4 className="font-medium">Security</h4>
                <p className="text-sm text-muted-foreground">Hash validation enabled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-muted-foreground">
          <p>🔒 All transactions are secure and encrypted</p>
          <p className="text-sm mt-1">
            Powered by PayU Payment Gateway &amp; Firebase
          </p>
        </div>
      </div>
    </div>
  );
}

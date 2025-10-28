'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  // Check if user is using Google OAuth (can't change password)
  const isGoogleUser = user.providerData[0]?.providerId === 'google.com';

  if (isGoogleUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Change Password</h1>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="text-center p-8 border rounded-lg">
                <p className="text-muted-foreground">
                  You signed in with Google. Password changes must be done through your Google account settings.
                </p>
                <Link href="/profile" className="mt-4 inline-block">
                  <Button>Return to Profile</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Change Password</h1>
        </div>

        <div className="flex justify-center">
          <ChangePasswordForm
            onSuccess={() => router.push('/profile')}
            onCancel={() => router.push('/profile')}
          />
        </div>
      </div>
    </div>
  );
}

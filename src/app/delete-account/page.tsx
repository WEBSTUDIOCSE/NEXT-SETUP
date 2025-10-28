'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DeleteAccountForm from '@/components/auth/DeleteAccountForm';

export default function DeleteAccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not loading and no user
    if (!loading && !user) {
      router.replace('/login?message=Please sign in to access account deletion');
    }
  }, [user, loading, router]);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-destructive">Delete Account</h1>
            <p className="text-muted-foreground mt-2">
              Permanently remove your account and all associated data
            </p>
          </div>
          
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}

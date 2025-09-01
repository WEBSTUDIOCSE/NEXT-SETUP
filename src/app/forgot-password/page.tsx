'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { ProfileSkeleton } from '@/components/common/CommonSkeleton';

export default function ForgotPasswordPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ProfileSkeleton className="text-center" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ForgotPasswordForm 
        onSuccess={() => router.push('/login')}
        showBackToLogin={true}
      />
    </div>
  );
}

import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { ProfileSkeleton } from '@/components/common/CommonSkeleton';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><ProfileSkeleton /></div>}>
      <LoginForm />
    </Suspense>
  );
}

'use client';

import { Suspense } from 'react';
import { CommonSkeleton } from '@/components/common/CommonSkeleton';
import PaymentSuccessContent from './PaymentSuccessContent';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<CommonSkeleton />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

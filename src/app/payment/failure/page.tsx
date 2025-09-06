'use client';

import { Suspense } from 'react';
import { CommonSkeleton } from '@/components/common/CommonSkeleton';
import PaymentFailureContent from './PaymentFailureContent';

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<CommonSkeleton />}>
      <PaymentFailureContent />
    </Suspense>
  );
}

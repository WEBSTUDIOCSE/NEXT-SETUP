'use client';

import { Suspense } from 'react';
import PaymentFailureContent from './PaymentFailureContent';

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailureContent />
    </Suspense>
  );
}

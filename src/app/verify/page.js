
'use client';
import React, { Suspense } from 'react';

import VerifyClient from "./VerifyPageClient";

export default function VerifyPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyClient />
    </Suspense>
  );
}

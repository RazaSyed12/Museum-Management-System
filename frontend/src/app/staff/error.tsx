'use client';

import { RequestError } from '@/components/staff/Shared';
export default function StaffError({ reset }: { reset: () => void }) {
  return (
    <RequestError
      error="The staff portal encountered a problem. Your saved records are unchanged."
      retry={reset}
    />
  );
}

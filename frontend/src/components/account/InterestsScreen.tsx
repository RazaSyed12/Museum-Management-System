'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/forms/Button';
import { Icon } from '@/components/foundation/Icon';
import { useAuth } from '@/lib/auth';
import { interests as ALL_INTERESTS } from '@/lib/sample-data';
import { cn } from '@/lib/cn';

const ICONS: Record<string, string> = {
  Dinosaurs: 'bone',
  Prehistory: 'mountain',
  'Ancient History': 'landmark',
  Archaeology: 'shovel',
  Medieval: 'castle',
  Renaissance: 'palette',
  Art: 'frame',
  'Natural History': 'leaf',
};

export function InterestsScreen() {
  const auth = useAuth();
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>(auth.user?.interests ?? []);

  function toggle(interest: string) {
    setPicked((cur) => (cur.includes(interest) ? cur.filter((i) => i !== interest) : [...cur, interest]));
  }

  function save() {
    auth.updateInterests(picked);
    router.push('/account');
  }

  return (
    <AuthLayout
      title="What are you interested in?"
      intro="Pick a few and we'll start you off with collections and events that match. You can change these any time."
    >
      <div className="grid grid-cols-2 gap-3">
        {ALL_INTERESTS.map((interest) => {
          const on = picked.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              aria-pressed={on}
              className={cn(
                'flex min-h-14 items-center gap-3 rounded-md border px-4 text-left type-body-sm transition-control',
                on ? 'border-olive-500 bg-olive-50 font-semibold text-olive-700 shadow-focus' : 'border-default bg-surface-card text-heading',
              )}
            >
              <Icon name={ICONS[interest] ?? 'tag'} size={18} className={on ? 'text-olive-600' : 'text-muted'} />
              <span className="flex-1">{interest}</span>
              {on && <Icon name="check" size={16} />}
            </button>
          );
        })}
      </div>
      <div className="mt-6 grid gap-3">
        <Button size="lg" fullWidth disabled={!picked.length} onClick={save}>
          Save {picked.length} interest{picked.length === 1 ? '' : 's'}
        </Button>
        <Button variant="ghost" fullWidth onClick={() => router.push('/account')}>Skip for now</Button>
      </div>
    </AuthLayout>
  );
}

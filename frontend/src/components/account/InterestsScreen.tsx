'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/forms/Button';
import { Icon } from '@/components/foundation/Icon';
import { Alert } from '@/components/feedback/Alert';
import { useAuth } from '@/lib/auth';
import { interests as ALL_INTERESTS } from '@/lib/content';
import { cn } from '@/lib/cn';
import { ApiError } from '@/lib/api/client';
import { getToken } from '@/lib/api/authed';
import {
  getInterestPicks,
  listInterestOptions,
  profileMockingDisabled,
  saveInterestPicks,
  type InterestOption,
} from '@/lib/api/preferences';

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
  const real = profileMockingDisabled();
  // Mock: the static list, keyed by name. Real: the museum's categories, keyed by id.
  const [options, setOptions] = useState<InterestOption[]>(() =>
    real ? [] : ALL_INTERESTS.map((i) => ({ id: i, name: i })),
  );
  const [picked, setPicked] = useState<string[]>(() => (real ? [] : (auth.user?.interests ?? [])));
  const [loading, setLoading] = useState(real);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  // Real backend: load the categories and the account's saved picks.
  useEffect(() => {
    if (!real || !auth.ready) return;
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    Promise.all([listInterestOptions(), getInterestPicks(token)])
      .then(([all, mine]) => {
        if (cancelled) return;
        setOptions(all);
        setPicked(mine.map((m) => m.id).filter((id) => all.some((o) => o.id === id)));
      })
      .catch(() => !cancelled && setError('We couldn’t load the interests. Please refresh the page.'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [real, auth.ready]);

  function toggle(id: string) {
    setPicked((cur) => (cur.includes(id) ? cur.filter((i) => i !== id) : [...cur, id]));
  }

  async function save() {
    if (!real) {
      auth.updateInterests(picked);
      router.push('/account');
      return;
    }
    const token = getToken();
    if (!token) {
      setError('Your session has expired. Please sign in again.');
      return;
    }
    setSaving(true);
    setError(undefined);
    try {
      const saved = await saveInterestPicks(token, picked);
      auth.updateInterests(saved.map((s) => s.name)); // keeps the screens that read user.interests in step
      router.push('/account');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'We couldn’t save your interests. Please try again.');
      setSaving(false);
    }
  }

  return (
    <AuthLayout
      title="What are you interested in?"
      intro="Pick a few and we'll start you off with collections and events that match. You can change these any time."
    >
      {error && (
        <div className="mb-4">
          <Alert tone="danger" title="Interests" onDismiss={() => setError(undefined)}>
            {error}
          </Alert>
        </div>
      )}
      {loading && <p className="type-body text-muted">Loading interests…</p>}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const interest = option.name;
          const on = picked.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              aria-pressed={on}
              className={cn(
                'flex min-h-14 items-center gap-3 rounded-md border px-4 text-left type-body-sm transition-control',
                on
                  ? 'border-olive-500 bg-olive-50 font-semibold text-olive-700 shadow-focus'
                  : 'border-default bg-surface-card text-heading',
              )}
            >
              <Icon
                name={ICONS[interest] ?? 'tag'}
                size={18}
                className={on ? 'text-olive-600' : 'text-muted'}
              />
              <span className="flex-1">{interest}</span>
              {on && <Icon name="check" size={16} />}
            </button>
          );
        })}
      </div>
      <div className="mt-6 grid gap-3">
        <Button size="lg" fullWidth loading={saving} disabled={!picked.length || loading} onClick={save}>
          Save {picked.length} interest{picked.length === 1 ? '' : 's'}
        </Button>
        <Button variant="ghost" fullWidth onClick={() => router.push('/account')}>
          Skip for now
        </Button>
      </div>
    </AuthLayout>
  );
}

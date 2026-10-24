'use client';

import { useState, type FormEvent } from 'react';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/forms/Button';
import { Checkbox } from '@/components/forms/Checkbox';
import { Alert } from '@/components/feedback/Alert';
import { Tabs } from '@/components/navigation/Tabs';
import { staffApi } from '@/lib/api/staff';
import type { MuseumSettings } from '@/lib/staff/types';
import { useStaffSession } from '@/lib/staff/session';
import { can } from '@/lib/staff/permissions';
import { ImageGallery } from './ImageGallery';
import {
  Loading,
  PageHeading,
  Panel,
  RequestError,
  staffDataChanged,
  useStaffData,
} from './Shared';

function SettingsForm({ settings }: { settings: MuseumSettings }) {
  const { user } = useStaffSession();
  const [values, setValues] = useState(settings);
  const [tab, setTab] = useState('museum');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const admin = can(user?.role, 'settings');
  const editable = can(user?.role, 'contacts');
  function set<K extends keyof MuseumSettings>(key: K, value: MuseumSettings[K]) {
    setSuccess(false);
    setValues((old) => ({ ...old, [key]: value }));
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    setSuccess(false);
    try {
      const input: Partial<MuseumSettings> = admin
        ? values
        : {
            name: values.name,
            address: values.address,
            phone: values.phone,
            email: values.email,
            website: values.website,
            logo: values.logo,
            bookingNotifications: values.bookingNotifications,
            eventNotifications: values.eventNotifications,
            membershipNotifications: values.membershipNotifications,
          };
      setValues(await staffApi.saveSettings(input));
      setSuccess(true);
      staffDataChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.');
    } finally {
      setBusy(false);
    }
  }
  const tabs = [
    { value: 'museum', label: 'Museum information' },
    { value: 'notifications', label: 'Notifications' },
    ...(user?.role !== 'Staff'
      ? [
          { value: 'tickets', label: 'Ticket rules' },
          { value: 'memberships', label: 'Membership plans' },
        ]
      : []),
    ...(admin ? [{ value: 'system', label: 'System' }] : []),
  ];
  return (
    <form className="grid gap-6" onSubmit={save}>
      <Tabs items={tabs} value={tab} onChange={setTab} />
      {error && <Alert tone="danger">{error}</Alert>}
      {success && (
        <Alert tone="success" title="Settings saved">
          The updated settings are available to related views.
        </Alert>
      )}
      <Panel title={tabs.find((t) => t.value === tab)?.label}>
        <div className="grid max-w-220 gap-5 md:grid-cols-2">
          {tab === 'museum' && (
            <>
              {(
                [
                  { key: 'name', label: 'Museum name', required: true },
                  { key: 'address', label: 'Address' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'email', label: 'Email', type: 'email' },
                  { key: 'website', label: 'Website', type: 'url' },
                ] as const
              ).map((field) => (
                <Field key={field.key} label={field.label} htmlFor={`setting-${field.key}`}>
                  <Input
                    id={`setting-${field.key}`}
                    type={'type' in field ? field.type : 'text'}
                    required={'required' in field && field.required}
                    value={values[field.key]}
                    disabled={!editable}
                    onChange={(e) => set(field.key, e.target.value)}
                  />
                </Field>
              ))}
              {editable && (
                <div className="md:col-span-2">
                  <ImageGallery
                    images={values.logo ? [values.logo] : []}
                    onChange={(images) => set('logo', images[images.length - 1] ?? null)}
                  />
                </div>
              )}
            </>
          )}
          {tab === 'notifications' && (
            <div className="grid gap-5 md:col-span-2">
              {(
                [
                  {
                    key: 'bookingNotifications',
                    label: 'New booking notifications',
                  },
                  {
                    key: 'eventNotifications',
                    label: 'Event and capacity notifications',
                  },
                  {
                    key: 'membershipNotifications',
                    label: 'Membership expiry notifications',
                  },
                ] as const
              ).map((setting) => (
                <Checkbox
                  key={setting.key}
                  id={setting.key}
                  label={setting.label}
                  checked={values[setting.key]}
                  disabled={!editable}
                  onChange={(e) => set(setting.key, e.target.checked)}
                />
              ))}
              <p className="text-sm text-muted">
                These preferences apply to museum notifications. Email delivery is supplied by the
                backend.
              </p>
            </div>
          )}
          {tab === 'tickets' && (
            <>
              <Field label="Default general ticket price (AUD)" htmlFor="default-ticket">
                <Input
                  id="default-ticket"
                  type="number"
                  min={0}
                  step="0.01"
                  value={values.defaultPrice / 100}
                  disabled={!admin}
                  onChange={(e) => set('defaultPrice', Math.round(Number(e.target.value) * 100))}
                />
              </Field>
              <Field label="Cancellation notice (hours)" htmlFor="cancellation-hours">
                <Input
                  id="cancellation-hours"
                  type="number"
                  min={0}
                  step={1}
                  value={values.cancellationHours}
                  disabled={!admin}
                  onChange={(e) => set('cancellationHours', Number(e.target.value))}
                />
              </Field>
              <p className="text-sm text-muted md:col-span-2">
                Event-specific ticket prices override the default. Capacity applies to the whole
                event. Prices are in AUD with no additional prototype fee or tax line.
              </p>
            </>
          )}
          {tab === 'memberships' && (
            <>
              {(
                [
                  {
                    key: 'individualPrice',
                    label: 'Individual',
                    hint: 'One named adult',
                  },
                  {
                    key: 'jointPrice',
                    label: 'Joint',
                    hint: 'Two named adults',
                  },
                  {
                    key: 'familyPrice',
                    label: 'Family',
                    hint: 'Two adults and up to four children',
                  },
                ] as const
              ).map((plan) => (
                <Field
                  key={plan.key}
                  label={`${plan.label} annual price (AUD)`}
                  htmlFor={plan.key}
                  hint={plan.hint}
                >
                  <Input
                    id={plan.key}
                    type="number"
                    min={0}
                    step="0.01"
                    disabled={!admin}
                    value={values[plan.key] / 100}
                    onChange={(e) => set(plan.key, Math.round(Number(e.target.value) * 100))}
                  />
                </Field>
              ))}
              <p className="text-sm text-muted md:col-span-2">
                Membership lasts one year. Price changes apply to new memberships; existing purchase
                prices are preserved.
              </p>
            </>
          )}
          {tab === 'system' && (
            <>
              <Field label="Museum timezone" htmlFor="museum-timezone">
                <Input id="museum-timezone" value={values.timezone} readOnly />
              </Field>
              <Field label="Currency" htmlFor="museum-currency">
                <Input id="museum-currency" value={values.currency} readOnly />
              </Field>
              <p className="text-sm text-muted md:col-span-2">
                The prototype uses Adelaide local time and AUD throughout the staff portal.
                Authentication, email delivery and storage are configured by the backend team.
              </p>
            </>
          )}
        </div>
      </Panel>
      {editable && (
        <div>
          <Button type="submit" loading={busy}>
            Save settings
          </Button>
        </div>
      )}
    </form>
  );
}

export function SettingsScreen() {
  const result = useStaffData(() => staffApi.settings());
  return (
    <>
      <PageHeading
        title="Settings"
        description="Museum details, operational defaults, and notification preferences."
      />
      {result.error ? (
        <RequestError error={result.error} retry={result.refresh} />
      ) : !result.data ? (
        <Loading />
      ) : (
        <SettingsForm settings={result.data} />
      )}
    </>
  );
}

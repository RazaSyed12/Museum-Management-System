'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStaffSession } from '@/lib/staff/session';
import {
  LIVE_RESOURCES,
  string,
  type BackendRecord,
  type LiveResource,
} from '@/lib/staff/backend-resources';
import { formValue } from '@/lib/api/staff-backend';
import { adelaideTimestamp } from '@/lib/staff/format';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Field } from '@/components/forms/Field';
import { Checkbox } from '@/components/forms/Checkbox';
import { Alert } from '@/components/feedback/Alert';
import { PageHeading, Panel, staffDataChanged } from './Shared';
import { title } from '@/lib/staff/backend-resources';
import { ReferenceControl } from './LiveRecordFields';
export function LiveRecordEditor({
  resource,
  record,
}: {
  resource: LiveResource;
  record?: BackendRecord;
}) {
  const { backend, user } = useStaffSession();
  const def = LIVE_RESOURCES[resource];
  const router = useRouter();
  const params = useSearchParams();
  const id = record ? string(record[def.id]) : undefined;
  const fields = def.fields.filter((field) => !(record ? field.createOnly : field.editOnly));
  const [values, setValues] = useState<Record<string, string | string[]>>(() =>
    Object.fromEntries(
      fields.map((field) => [
        field.key,
        record
          ? formValue(record, field.key, field.type)
          : field.multiple
            ? []
            : ((field.key === 'visitor_id' ? params.get(field.key) : null) ?? field.default ?? ''),
      ]),
    ),
  );
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [partial, setPartial] = useState<{ id: string; categories: unknown; message: string }>();
  const submitted = useRef(false);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      if (!submitted.current) event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function change(key: string, value: string | string[]) {
    setDirty(true);
    setValues((current) => ({ ...current, [key]: value }));
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || uploading) return;
    setError('');
    const errors: Record<string, string> = {};
    const payload: BackendRecord = {};
    try {
      for (const field of fields) {
        const value = values[field.key];
        const initial = record ? formValue(record, field.key, field.type) : undefined;
        if (record && JSON.stringify(value) === JSON.stringify(initial)) continue;
        if (field.required && (!value || (Array.isArray(value) ? !value.length : !value.trim()))) {
          errors[field.key] = `${field.label} is required.`;
          continue;
        }
        if (field.multiple) {
          const ids = Array.isArray(value) ? value : [];
          if (ids.length > 20) errors[field.key] = 'Choose no more than 20 records.';
          payload[field.key] = ids;
        } else if (field.type === 'checkbox') payload[field.key] = value === 'true';
        else if (field.type === 'tags') {
          const tags = [
            ...new Set(
              string(value)
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
            ),
          ];
          if (tags.length > 30 || tags.some((tag) => tag.length > 50))
            errors[field.key] = 'Use up to 30 tags, each no longer than 50 characters.';
          payload[field.key] = tags;
        } else if (value === '' || value === undefined) {
          if (record) payload[field.key] = null;
        } else if (field.type === 'number' || field.type === 'money') {
          const number = Number(value);
          if (
            !Number.isFinite(number) ||
            number < (field.min ?? 0) ||
            (field.max !== undefined && number > field.max) ||
            (field.type === 'number' && !Number.isInteger(number))
          )
            errors[field.key] =
              `Enter a valid ${field.type === 'number' ? 'whole number' : 'price'}.`;
          payload[field.key] = field.type === 'money' ? Math.round(number * 100) / 100 : number;
        } else if (field.type === 'datetime-local')
          payload[field.key] = adelaideTimestamp(string(value));
        else {
          if (field.maxLength && string(value).trim().length > field.maxLength)
            errors[field.key] = `Use no more than ${field.maxLength} characters.`;
          payload[field.key] = string(value).trim();
        }
      }
      if (resource === 'events') {
        if (
          Date.parse(string(payload.end_at ?? record?.end_at)) <=
          Date.parse(string(payload.start_at ?? record?.start_at))
        )
          errors.end_at = 'End time must be after start time.';
      }
      if (
        resource === 'memberships' &&
        !record &&
        Boolean(values.visitor_id) === Boolean(values.user_id)
      )
        errors.visitor_id = 'Choose either a visitor or an account holder.';
      if (resource === 'hero' && values.event_id && values.collection_id)
        errors.collection_id = 'Link to an event or a collection, not both.';
      if (resource === 'hero') {
        for (const prefix of ['primary', 'secondary']) {
          if (Boolean(values[`${prefix}_label`]) !== Boolean(values[`${prefix}_href`]))
            errors[`${prefix}_href`] = 'Enter both a button label and a link, or leave both empty.';
        }
      }
      if (resource === 'users' && values.role === 'staff' && !values.tier)
        errors.tier = 'Choose a staff tier.';
      if (resource === 'memberships' && user?.role !== 'Admin') delete payload.user_id;
      setFieldErrors(errors);
      if (Object.keys(errors).length) {
        document.getElementById(`live-${Object.keys(errors)[0]}`)?.focus();
        return;
      }
      if (!Object.keys(payload).length) {
        router.push(`/staff/${resource}/${id}`);
        return;
      }
      setBusy(true);
      const result = await backend.save(resource, payload, id);
      const recordId = string(result.record[def.id]);
      if (result.warning) {
        setPartial({ id: recordId, categories: payload.category_ids, message: result.warning });
        setDirty(true);
        staffDataChanged();
        return;
      }
      submitted.current = true;
      setDirty(false);
      staffDataChanged();
      router.push(`/staff/${resource}/${encodeURIComponent(recordId)}?saved=1`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save the record.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        title={`${record ? 'Edit' : 'New'} ${def.singular}`}
        description={def.notice ?? 'Changes are saved to the museum catalogue.'}
      />
      <Panel>
        <form onSubmit={submit} className="grid gap-5">
          {error && <Alert tone="danger">{error}</Alert>}
          {partial && (
            <Alert tone="warning" title="Collection fields saved; categories need attention">
              <p>{partial.message} Your selected categories are retained below.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  loading={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError('');
                    try {
                      const result = await backend.save(
                        'collections',
                        { category_ids: partial.categories },
                        partial.id,
                      );
                      if (result.warning) {
                        setPartial({ ...partial, message: result.warning });
                        return;
                      }
                      submitted.current = true;
                      setDirty(false);
                      staffDataChanged();
                      router.push(`/staff/collections/${partial.id}?saved=1`);
                    } catch (failure) {
                      setError(
                        failure instanceof Error ? failure.message : 'Could not update categories.',
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Retry categories
                </Button>
                <Button
                  variant="ghost"
                  disabled={busy}
                  onClick={() => {
                    submitted.current = true;
                    router.push(`/staff/collections/${partial.id}?partial=1`);
                  }}
                >
                  View saved collection
                </Button>
              </div>
            </Alert>
          )}
          <fieldset
            disabled={busy || Boolean(partial)}
            className="grid gap-5 border-0 p-0 md:grid-cols-2"
          >
            {fields.map((field) => (
              <Field
                key={field.key}
                label={field.label}
                htmlFor={`live-${field.key}`}
                hint={field.hint}
                required={field.required}
                error={fieldErrors[field.key]}
                className={field.type === 'textarea' || field.multiple ? 'md:col-span-2' : ''}
              >
                {field.reference ? (
                  <ReferenceControl
                    field={field}
                    id={`live-${field.key}`}
                    value={values[field.key] ?? ''}
                    onChange={(value) => change(field.key, value)}
                    excludeId={resource === 'categories' ? id : undefined}
                    onBusy={setUploading}
                  />
                ) : field.type === 'checkbox' ? (
                  <Checkbox
                    id={`live-${field.key}`}
                    label={field.label}
                    checked={values[field.key] === 'true'}
                    onChange={(event) => change(field.key, String(event.target.checked))}
                  />
                ) : field.options ? (
                  <Select
                    id={`live-${field.key}`}
                    value={string(values[field.key])}
                    required={field.required}
                    onChange={(event) => change(field.key, event.target.value)}
                  >
                    <option value="">Choose…</option>
                    {!field.options.includes(string(values[field.key])) && values[field.key] && (
                      <option value={string(values[field.key])}>{title(values[field.key])}</option>
                    )}
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {title(option)}
                      </option>
                    ))}
                  </Select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={`live-${field.key}`}
                    value={string(values[field.key])}
                    maxLength={field.maxLength}
                    rows={5}
                    className="w-full rounded-md border border-line-default bg-surface-card p-3 text-body"
                    onChange={(event) => change(field.key, event.target.value)}
                  />
                ) : (
                  <Input
                    id={`live-${field.key}`}
                    type={
                      field.type === 'money'
                        ? 'number'
                        : field.type === 'tags'
                          ? 'text'
                          : (field.type ?? 'text')
                    }
                    value={string(values[field.key])}
                    min={field.min}
                    max={field.max}
                    maxLength={field.maxLength}
                    step={
                      field.type === 'money' ? '0.01' : field.type === 'number' ? '1' : undefined
                    }
                    onChange={(event) => change(field.key, event.target.value)}
                  />
                )}
              </Field>
            ))}
          </fieldset>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" loading={busy} disabled={uploading || Boolean(partial)}>
              Save {def.singular}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                if (!dirty || window.confirm('Discard your unsaved changes?'))
                  router.push(id ? `/staff/${resource}/${id}` : `/staff/${resource}`);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Panel>
    </>
  );
}

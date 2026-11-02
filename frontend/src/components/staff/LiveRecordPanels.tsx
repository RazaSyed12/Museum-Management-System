'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useStaffSession } from '@/lib/staff/session';
import {
  records,
  string,
  type BackendRecord,
  type LiveResource,
} from '@/lib/staff/backend-resources';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Checkbox } from '@/components/forms/Checkbox';
import { Field } from '@/components/forms/Field';
import { Media } from '@/components/foundation/Media';
import { Alert } from '@/components/feedback/Alert';
import { Loading, Panel, RequestError, staffDataChanged, useStaffData } from './Shared';

export function LiveMedia({ resource, id }: { resource: LiveResource; id: string }) {
  const { backend } = useStaffSession();
  const [images, setImages] = useState<BackendRecord[]>([]);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const path = `/${resource}/${encodeURIComponent(id)}/media`;
  const result = useStaffData(
    async (signal) => records((await backend.request(path, { signal })).media),
    [path],
  );
  const previous = useRef<BackendRecord[] | undefined>(undefined);
  useEffect(() => {
    if (result.data !== previous.current && result.data) {
      previous.current = result.data;
      if (!dirty) setImages(result.data);
    }
  }, [result.data, dirty]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function change(next: BackendRecord[]) {
    setImages(next);
    setDirty(true);
    setMessage('');
  }
  async function save(next = images) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      for (const image of next) {
        await backend.request(`/media/${encodeURIComponent(string(image.media_id))}`, {
          method: 'PATCH',
          body: JSON.stringify({ alt_text: string(image.alt_text) || null }),
        });
      }
      const data = await backend.request(path, {
        method: 'PUT',
        body: JSON.stringify({ media_ids: next.map((image) => image.media_id) }),
      });
      setImages(records(data.media));
      setDirty(false);
      setMessage('Images saved.');
      staffDataChanged();
    } catch (failure) {
      setError(
        `${failure instanceof Error ? failure.message : 'Images could not be saved.'} Some changes may have saved. Your selections are retained so you can retry.`,
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel title="Images">
      <div className="grid gap-4">
        <p className="text-sm text-muted">
          The first image is primary. Removing an attachment leaves the image available to other
          records. Alternative text is shared wherever the image is used.
        </p>
        {error && <Alert tone="danger">{error}</Alert>}
        {message && <Alert tone="success">{message}</Alert>}
        {result.error ? (
          <RequestError error={result.error} retry={result.refresh} />
        ) : !result.data ? (
          <Loading />
        ) : (
          <>
            {images.map((image, index) => (
              <div
                key={string(image.media_id)}
                className="grid gap-4 rounded-md border border-line-subtle p-3 md:grid-cols-[120px_1fr]"
              >
                <Media src={string(image.url)} alt={string(image.alt_text)} ratio="4 / 3" />
                <div className="grid gap-3">
                  <span className="type-label break-all">
                    {index === 0 ? 'Primary · ' : ''}
                    {string(image.original_filename) || `Image ${index + 1}`}
                  </span>
                  <Field label="Alternative text" htmlFor={`media-alt-${image.media_id}`}>
                    <Input
                      id={`media-alt-${image.media_id}`}
                      value={string(image.alt_text)}
                      maxLength={300}
                      disabled={busy}
                      onChange={(event) =>
                        change(
                          images.map((row) =>
                            row.media_id === image.media_id
                              ? { ...row, alt_text: event.target.value }
                              : row,
                          ),
                        )
                      }
                    />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busy || index === 0}
                      onClick={() => {
                        const next = [...images];
                        [next[index - 1], next[index]] = [next[index]!, next[index - 1]!];
                        change(next);
                      }}
                    >
                      Move earlier
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busy || index === images.length - 1}
                      onClick={() => {
                        const next = [...images];
                        [next[index + 1], next[index]] = [next[index]!, next[index + 1]!];
                        change(next);
                      }}
                    >
                      Move later
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() =>
                        change(images.filter((row) => row.media_id !== image.media_id))
                      }
                    >
                      Remove attachment
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {!images.length && <p className="text-muted">No images attached.</p>}
            <Field
              label="Upload images"
              htmlFor="record-media"
              hint="Uploads are attached automatically. JPG, PNG, WebP or GIF · up to 5 MB each."
            >
              <Input
                id="record-media"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={busy}
                onChange={async (event) => {
                  const input = event.target;
                  const files = Array.from(input.files ?? []);
                  if (images.length + files.length > 50) {
                    setError('Attach no more than 50 images.');
                    input.value = '';
                    return;
                  }
                  setBusy(true);
                  setError('');
                  setMessage('');
                  const next = [...images];
                  try {
                    for (const file of files) {
                      const image = await backend.upload(file);
                      next.push(image);
                      setImages([...next]);
                      setDirty(true);
                    }
                    await save(next);
                  } catch (failure) {
                    setError(
                      failure instanceof Error
                        ? failure.message
                        : 'Upload failed. Successfully uploaded images remain below for saving.',
                    );
                  } finally {
                    setBusy(false);
                    input.value = '';
                  }
                }}
              />
            </Field>
            <div className="flex flex-wrap gap-3">
              <Button disabled={!dirty} loading={busy} onClick={() => void save()}>
                Save images
              </Button>
              <Button
                variant="secondary"
                disabled={busy || images.length >= 50}
                onClick={() => setLibraryOpen((open) => !open)}
              >
                Choose from library
              </Button>
            </div>
            {libraryOpen && (
              <MediaLibrary
                excluded={images.map((image) => string(image.media_id))}
                onChoose={(image) => {
                  const next = [...images, image];
                  change(next);
                  setLibraryOpen(false);
                  void save(next);
                }}
              />
            )}
          </>
        )}
      </div>
    </Panel>
  );
}

function MediaLibrary({
  excluded,
  onChoose,
}: {
  excluded: string[];
  onChoose: (image: BackendRecord) => void;
}) {
  const { backend } = useStaffSession();
  const [selected, setSelected] = useState('');
  const result = useStaffData((signal) => backend.all('media', signal));
  if (result.error) return <RequestError error={result.error} retry={result.refresh} />;
  if (!result.data) return <Loading />;
  const choices = result.data.filter((image) => !excluded.includes(string(image.media_id)));
  const image = choices.find((row) => row.media_id === selected);
  return (
    <div className="grid gap-3 rounded-md border border-line-subtle p-4">
      <Field label="Existing image" htmlFor="existing-media">
        <Select
          id="existing-media"
          value={selected}
          options={[
            { value: '', label: 'Choose an image' },
            ...choices.map((row) => ({
              value: string(row.media_id),
              label: string(row.original_filename || row.alt_text) || 'Museum image',
            })),
          ]}
          onChange={(event) => setSelected(event.target.value)}
        />
      </Field>
      {image && (
        <div className="max-w-60">
          <Media src={string(image.url)} alt={string(image.alt_text)} ratio="4 / 3" />
        </div>
      )}
      <div>
        <Button
          disabled={!image}
          onClick={() => {
            if (image) onChoose(image);
          }}
        >
          Attach image
        </Button>
      </div>
      {!choices.length && (
        <p className="text-sm text-muted">All library images are already attached.</p>
      )}
    </div>
  );
}

export function LiveAllocations({ id }: { id: string }) {
  const { backend } = useStaffSession();
  const result = useStaffData(
    (signal) => backend.request(`/events/${encodeURIComponent(id)}/allocations`, { signal }),
    [id],
  );
  return (
    <Panel title="Ticket allocations">
      {result.error ? (
        <RequestError error={result.error} retry={result.refresh} />
      ) : !result.data ? (
        <Loading />
      ) : (
        <div className="grid gap-4">
          <p className="text-sm text-muted">
            Capacity: {Number(result.data.capacity)} · Allocated:{' '}
            {Number(result.data.allocated_total)} · Unallocated: {Number(result.data.unallocated)}.
            Availability comes from reservations, not the total event capacity.
          </p>
          {records(result.data.allocations).map((allocation) => (
            <AllocationEditor
              key={string(allocation.allocation_id)}
              eventId={id}
              allocation={allocation}
              refresh={result.refresh}
            />
          ))}
          <AllocationEditor eventId={id} refresh={result.refresh} />
        </div>
      )}
    </Panel>
  );
}
function AllocationEditor({
  eventId,
  allocation,
  refresh,
}: {
  eventId: string;
  allocation?: BackendRecord;
  refresh: () => void;
}) {
  const { backend } = useStaffSession();
  const [name, setName] = useState(string(allocation?.allocation_name));
  const [quantity, setQuantity] = useState(string(allocation?.quantity));
  const [members, setMembers] = useState(Boolean(allocation?.membership_required));
  const [kind, setKind] = useState(string(allocation?.ticket_kind) || (members ? 'member' : 'general'));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await backend.request(
        allocation ? `/allocations/${allocation.allocation_id}` : `/events/${eventId}/allocations`,
        {
          method: allocation ? 'PATCH' : 'POST',
          body: JSON.stringify({
            allocation_name: name.trim(),
            quantity: Number(quantity),
            membership_required: members,
            ticket_kind: kind,
          }),
        },
      );
      if (!allocation) {
        setName('');
        setQuantity('');
        setMembers(false);
        setKind('general');
      }
      setMessage('Allocation saved.');
      refresh();
      staffDataChanged();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not save allocation.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save} className="grid gap-3 rounded-md border border-line-subtle p-4">
      <h3 className="type-label">
        {allocation
          ? `${Number(allocation.reserved_quantity)} reserved · ${Number(allocation.available)} available`
          : 'New allocation'}
      </h3>
      {error && <Alert tone="danger">{error}</Alert>}
      {message && <Alert tone="success">{message}</Alert>}
      <fieldset disabled={busy} className="grid gap-3 border-0 p-0 md:grid-cols-2">
        <Field label="Ticket price type" htmlFor={`allocation-kind-${allocation?.allocation_id ?? 'new'}`}>
          <Select id={`allocation-kind-${allocation?.allocation_id ?? 'new'}`} value={kind}
            options={[{value: 'general', label: 'General admission'}, {value: 'member', label: 'Member admission'}, {value: 'child', label: 'Child or student'}]}
            onChange={(event) => { setKind(event.target.value); setMembers(event.target.value === 'member'); }} />
        </Field>
        <Field
          label="Allocation name"
          htmlFor={`allocation-name-${allocation?.allocation_id ?? 'new'}`}
        >
          <Input
            id={`allocation-name-${allocation?.allocation_id ?? 'new'}`}
            required
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Field>
        <Field
          label="Quantity"
          htmlFor={`allocation-quantity-${allocation?.allocation_id ?? 'new'}`}
        >
          <Input
            id={`allocation-quantity-${allocation?.allocation_id ?? 'new'}`}
            required
            type="number"
            min={allocation ? Number(allocation.reserved_quantity) : 1}
            max={1000000}
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </Field>
        <Checkbox
          label="Membership required"
          checked={members}
          onChange={(event) => { setMembers(event.target.checked); if (event.target.checked) setKind('member'); else if (kind === 'member') setKind('general'); }}
        />
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" loading={busy}>
          {allocation ? 'Save allocation' : 'Add allocation'}
        </Button>
        {allocation && (
          <Button
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={async () => {
              if (
                !window.confirm(
                  'Delete this allocation? Allocations with reservations or issued tickets cannot be deleted.',
                )
              )
                return;
              setBusy(true);
              setError('');
              try {
                await backend.request(`/allocations/${allocation.allocation_id}`, {
                  method: 'DELETE',
                });
                refresh();
                staffDataChanged();
              } catch (failure) {
                setError(
                  failure instanceof Error ? failure.message : 'Could not delete allocation.',
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            Delete allocation
          </Button>
        )}
      </div>
    </form>
  );
}

export function LiveBenefits({ id }: { id: string }) {
  const { backend } = useStaffSession();
  const result = useStaffData(
    async (signal) => records((await backend.get('plans', id, signal)).benefits),
    [id],
  );
  return (
    <Panel title="Plan benefits">
      {result.error ? (
        <RequestError error={result.error} retry={result.refresh} />
      ) : !result.data ? (
        <Loading />
      ) : (
        <div className="grid gap-4">
          <p className="text-sm text-muted">
            A percentage discount reduces booking charges. Existing benefit settings are retained
            when editing.
          </p>
          {result.data.map((benefit) => (
            <BenefitEditor
              key={string(benefit.benefit_id)}
              planId={id}
              benefit={benefit}
              refresh={result.refresh}
            />
          ))}
          <BenefitEditor planId={id} refresh={result.refresh} />
        </div>
      )}
    </Panel>
  );
}
function BenefitEditor({
  planId,
  benefit,
  refresh,
}: {
  planId: string;
  benefit?: BackendRecord;
  refresh: () => void;
}) {
  const { backend } = useStaffSession();
  const [kind, setKind] = useState(string(benefit?.benefit_type) || 'discount_percent');
  const [value, setValue] = useState(string(benefit?.benefit_value));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (
      kind === 'discount_percent' &&
      (!value.trim() || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 100)
    ) {
      setError('Enter a discount from 0 to 100.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await backend.request(
        benefit
          ? `/membership/benefits/${benefit.benefit_id}`
          : `/membership/plans/${planId}/benefits`,
        {
          method: benefit ? 'PATCH' : 'POST',
          body: JSON.stringify({ benefit_type: kind.trim(), benefit_value: value.trim() || null }),
        },
      );
      if (!benefit) {
        setKind('discount_percent');
        setValue('');
      }
      setMessage('Benefit saved.');
      refresh();
      staffDataChanged();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not save benefit.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save} className="grid gap-3 rounded-md border border-line-subtle p-4">
      <h3 className="type-label">{benefit ? 'Edit benefit' : 'New benefit'}</h3>
      {error && <Alert tone="danger">{error}</Alert>}
      {message && <Alert tone="success">{message}</Alert>}
      <fieldset disabled={busy} className="grid gap-3 border-0 p-0 md:grid-cols-2">
        <Field label="Benefit type" htmlFor={`benefit-type-${benefit?.benefit_id ?? 'new'}`}>
          <Select
            id={`benefit-type-${benefit?.benefit_id ?? 'new'}`}
            required
            value={kind}
            options={[
              ...new Set([
                'discount_percent',
                'priority_booking',
                'free_entry',
                ...(benefit ? [string(benefit.benefit_type)] : []),
              ]),
            ].map((value) => ({
              value,
              label:
                value === 'discount_percent'
                  ? 'Booking discount (%)'
                  : value === 'priority_booking'
                    ? 'Priority booking'
                    : value === 'free_entry'
                      ? 'Complimentary entry'
                      : value.replaceAll('_', ' '),
            }))}
            onChange={(event) => setKind(event.target.value)}
          />
        </Field>
        <Field
          label={kind === 'discount_percent' ? 'Discount (%)' : 'Benefit value'}
          htmlFor={`benefit-value-${benefit?.benefit_id ?? 'new'}`}
        >
          <Input
            id={`benefit-value-${benefit?.benefit_id ?? 'new'}`}
            maxLength={100}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Field>
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" type="submit" loading={busy}>
          {benefit ? 'Save benefit' : 'Add benefit'}
        </Button>
        {benefit && (
          <Button
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={async () => {
              if (!window.confirm('Delete this plan benefit?')) return;
              setBusy(true);
              setError('');
              try {
                await backend.request(`/membership/benefits/${benefit.benefit_id}`, {
                  method: 'DELETE',
                });
                refresh();
                staffDataChanged();
              } catch (failure) {
                setError(failure instanceof Error ? failure.message : 'Could not delete benefit.');
              } finally {
                setBusy(false);
              }
            }}
          >
            Delete benefit
          </Button>
        )}
      </div>
    </form>
  );
}

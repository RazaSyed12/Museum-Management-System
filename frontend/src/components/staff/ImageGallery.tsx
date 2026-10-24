'use client';

import { useRef, useState } from 'react';
import { Media } from '@/components/foundation/Media';
import { Button } from '@/components/forms/Button';
import { IconButton } from '@/components/forms/IconButton';
import { Input } from '@/components/forms/Input';
import { Field } from '@/components/forms/Field';
import { Alert } from '@/components/feedback/Alert';
import { staffApi } from '@/lib/api/staff';
import type { Asset } from '@/lib/staff/types';

export function ImageGallery({
  images,
  onChange,
  onBusyChange,
}: {
  images: Asset[];
  onChange: (images: Asset[]) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError('');
    setBusy(true);
    onBusyChange?.(true);
    try {
      const uploaded: Asset[] = [];
      for (const file of Array.from(files)) {
        if (
          !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
          file.size > 2 * 1024 * 1024
        )
          throw new Error('Choose JPG, PNG or WebP images up to 2 MB each.');
        uploaded.push(await staffApi.upload(file));
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload these images.');
    } finally {
      setBusy(false);
      onBusyChange?.(false);
      if (input.current) input.current.value = '';
    }
  }
  function move(index: number, offset: number) {
    const copy = [...images];
    const next = index + offset;
    if (next < 0 || next >= copy.length) return;
    [copy[index], copy[next]] = [copy[next]!, copy[index]!];
    onChange(copy);
  }
  return (
    <div className="grid gap-4">
      <div>
        <h2 className="type-h3">Images</h2>
        <p className="mt-1 text-sm text-muted">
          The first image is primary. Add alternative text and use the arrows to reorder.
        </p>
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
      <div className="grid gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="grid gap-4 rounded-md border border-line-subtle p-3 md:grid-cols-[120px_1fr]"
          >
            <Media src={image.url} alt={image.alt} ratio="4 / 3" />
            <div className="grid gap-3">
              <span className="type-label break-all text-heading">
                {index === 0 ? 'Primary · ' : ''}
                {image.name}
              </span>
              <Field label="Alternative text" htmlFor={`alt-${image.id}`}>
                <Input
                  id={`alt-${image.id}`}
                  value={image.alt}
                  onChange={(e) =>
                    onChange(
                      images.map((asset) =>
                        asset.id === image.id ? { ...asset, alt: e.target.value } : asset,
                      ),
                    )
                  }
                />
              </Field>
              <div className="flex gap-2">
                <IconButton
                  icon="arrow-up"
                  label={`Move ${image.name} earlier`}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                />
                <IconButton
                  icon="arrow-down"
                  label={`Move ${image.name} later`}
                  disabled={index === images.length - 1}
                  onClick={() => move(index, 1)}
                />
                <Button
                  variant="ghost"
                  onClick={() => onChange(images.filter((asset) => asset.id !== image.id))}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!busy) void upload(e.dataTransfer.files);
        }}
        className="grid justify-items-center gap-3 rounded-lg border-2 border-dashed border-line-default bg-surface-sunken p-6"
      >
        <p className="text-sm text-muted">
          Drop images here, or choose files. JPG, PNG, WebP · up to 2 MB each.
        </p>
        <input
          ref={input}
          aria-label="Upload museum images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          disabled={busy}
          onChange={(e) => void upload(e.target.files)}
        />
        <Button variant="secondary" loading={busy} onClick={() => input.current?.click()}>
          Choose images
        </Button>
      </div>
    </div>
  );
}

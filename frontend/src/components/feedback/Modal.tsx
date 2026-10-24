'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { IconButton } from '@/components/forms/IconButton';

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto max-h-[90dvh] w-[min(94vw,720px)] overflow-y-auto rounded-xl border border-line-subtle bg-surface-card p-0 text-body shadow-xl backdrop:bg-overlay-scrim"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line-subtle px-6 py-5">
        <h2 id={titleId} className="type-h3">
          {title}
        </h2>
        <IconButton icon="x" label="Close dialog" onClick={onClose} />
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  );
}

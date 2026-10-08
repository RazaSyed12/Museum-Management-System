import type { ReactNode } from 'react';
import { Logo } from '@/components/foundation/Logo';

export interface AuthLayoutProps {
  title: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Shared shell for sign in, register, forgot/reset password and the
 *  interests-onboarding step: a dark brand panel beside the form on desktop,
 *  the form alone on mobile. */
export function AuthLayout({ title, intro, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid lg:grid-cols-2">
      <div className="relative hidden flex-col justify-end gap-4 bg-green-900 p-16 lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#2A5033_0%,#14231A_100%)]" />
        <div className="relative grid gap-6">
          <Logo variant="mark" height={72} />
          <h2 className="max-w-105 text-4xl/[1.1] text-paper-50">Heritage lives here.</h2>
          <p className="type-body max-w-100 text-paper-100/78">
            An account keeps your tickets in one place and shapes what we suggest you see next.
            Membership is separate — and optional.
          </p>
        </div>
      </div>
      <div className="grid place-items-center p-8 md:p-16">
        <div className="grid w-full max-w-105 gap-6">
          <Logo variant="horizontal" height={40} />
          <div className="grid gap-2">
            <h1 className="text-4xl/tight">{title}</h1>
            {intro && <p className="type-body text-muted">{intro}</p>}
          </div>
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
}

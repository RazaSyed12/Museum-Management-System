'use client';

import { useRouter, usePathname } from 'next/navigation';

/**
 * Maps the design system's screen names (the labels used throughout
 * ui_kits/visitor_site — "Collections", "Tickets", "SignIn", ...) to real
 * routes. Only Home exists as a built page today; the rest point at the
 * section they'll live under once those pages are built, so navigation is
 * wired correctly now instead of being redone later.
 */
export const ROUTES = {
  Home: '/',
  Collections: '/collections',
  Collection: '/collections',
  Item: '/collections',
  Events: '/events',
  Event: '/events',
  Tickets: '/tickets',
  Membership: '/membership',
  SignIn: '/sign-in',
  Register: '/sign-in',
  Profile: '/account',
} as const;

/** Keys with a known route — useful for call sites that want autocomplete. */
export type ScreenName = keyof typeof ROUTES;

export interface SiteUser {
  name: string;
  initials: string;
}

export interface SiteNav {
  user?: SiteUser;
  isMember: boolean;
  active: string;
  /**
   * Plain `string`, not `ScreenName`: this is the boundary the design
   * system's own components call across (SiteHeader.onNavigate, etc.),
   * and those take arbitrary labels from a `string[]` items prop — not a
   * statically-known union. Unrecognised labels just fall back to '/'.
   */
  go: (label: string) => void;
}

/**
 * Shared shape the design system's `nav` prop expects (see
 * design-system/ui_kits/visitor_site/*: `nav.go`, `nav.user`, `nav.isMember`,
 * `nav.active`). Auth isn't wired up yet, so every visitor renders as
 * anonymous for now — swap `user`/`isMember` for real session state once
 * accounts exist, the components themselves already handle both cases.
 */
export function useSiteNav(): SiteNav {
  const router = useRouter();
  const pathname = usePathname();

  return {
    user: undefined,
    isMember: false,
    active: activeFromPath(pathname),
    go(label) {
      router.push(ROUTES[label as ScreenName] ?? '/');
    },
  };
}

function activeFromPath(pathname: string): ScreenName {
  const entry = (Object.entries(ROUTES) as [ScreenName, string][]).find(([, path]) => path === pathname);
  return entry ? entry[0] : 'Home';
}

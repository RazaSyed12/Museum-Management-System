import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    /* msw/browser's package export is blocked under Node's resolution
       condition (it's browser-only code) — but Next SSRs client
       components too, so the server build still has to resolve
       lib/api/client.ts's reference to it (behind a typeof-window guard
       that's never actually true server-side) and fails doing so before
       that guard is ever evaluated. Aliasing it to `false` (webpack's
       "stub to an empty module" sentinel) skips export resolution for it
       entirely on the server build only. See mswjs/msw#1877. */
    if (isServer) config.resolve.alias = { ...config.resolve.alias, 'msw/browser': false };
    return config;
  },
};

export default nextConfig;

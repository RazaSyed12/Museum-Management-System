FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, not
# read at runtime — they have to come in as build args, not just env vars
# on the running container. See fly.toml's [build.args].
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_MOCKING=disabled
ARG NEXT_PUBLIC_AUTH_API_MOCKING=disabled
ARG NEXT_PUBLIC_COLLECTIONS_API_MOCKING=disabled
ARG NEXT_PUBLIC_EVENTS_API_MOCKING=disabled
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_API_MOCKING=$NEXT_PUBLIC_API_MOCKING \
    NEXT_PUBLIC_AUTH_API_MOCKING=$NEXT_PUBLIC_AUTH_API_MOCKING \
    NEXT_PUBLIC_COLLECTIONS_API_MOCKING=$NEXT_PUBLIC_COLLECTIONS_API_MOCKING \
    NEXT_PUBLIC_EVENTS_API_MOCKING=$NEXT_PUBLIC_EVENTS_API_MOCKING

RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]

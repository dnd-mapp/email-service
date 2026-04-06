FROM --platform=$BUILDPLATFORM node:24.14.0 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app


FROM base AS builder

COPY package.json pnpm-*.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV="production"

RUN pnpm gen:prisma && \
    pnpm build


FROM node:24.14.0 AS packager
     
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY --from=builder /app/dist/auth-server .

COPY .docker/healthcheck.mjs .docker/entrypoint.sh prisma.config.ts ./

COPY --from=builder /app/prisma ./prisma

RUN chmod +x entrypoint.sh

ENV NODE_ENV="production"

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install


FROM node:24.14.0-alpine3.23

ENV NODE_ENV="production"

WORKDIR /app

COPY --from=packager /app .

HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=15s \
    CMD node /app/healthcheck.mjs

EXPOSE 4350

#ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["node", "/app/main.js"]

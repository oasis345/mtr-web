# 1) 빌드 스테이지
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 루트 설정 파일들 복사 (중요!)
COPY tsconfig.json ./
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# packages 복사 (모노레포 의존성)
COPY packages ./packages

# web 앱 복사
COPY apps/web ./apps/web

# 의존성 설치
RUN pnpm install --frozen-lockfile

# web 앱 빌드
RUN pnpm --filter web build

# 2) 런타임 스테이지
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드 결과물 복사 (standalone)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 8000

ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
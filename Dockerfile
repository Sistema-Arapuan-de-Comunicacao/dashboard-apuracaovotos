FROM node:22-alpine AS base

# Dependências
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Build
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Build do Next
RUN npm run build

# Produção
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Usuário não-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Next standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 5000

ENV PORT=5000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
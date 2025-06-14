ARG NODE_IMAGE=node:22-alpine

FROM $NODE_IMAGE AS deps
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn config set network-timeout 600000 -g
RUN yarn install --frozen-lockfile --ignore-scripts

FROM $NODE_IMAGE AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_OUTPUT_STANDALONE=1

RUN yarn run db:generate
RUN yarn build

FROM $NODE_IMAGE AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV STORE_PATH=/data/store.json
ENV FORCE_COLOR=1

RUN yarn global add prisma

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "prisma migrate deploy && node server"]

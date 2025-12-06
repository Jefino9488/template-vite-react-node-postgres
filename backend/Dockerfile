FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

FROM node:20-alpine AS runtime
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=builder /app .

EXPOSE 5000

CMD ["node", "src/index.js"]

FROM node:22-slim

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install all deps (including dev deps needed for build)
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the application
RUN pnpm build

# Prune dev dependencies after build
RUN pnpm prune --prod

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]

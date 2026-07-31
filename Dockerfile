FROM node:22-alpine

RUN npm install -g pnpm@9

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

RUN pnpm install --frozen-lockfile --prod

COPY dist/ ./dist/

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]

FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY apps/server/package.json ./apps/server/package.json

COPY apps/client/package.json ./apps/client/package.json

RUN npm ci --workspace=@azaria/server

COPY apps/server/prisma ./apps/server/prisma

RUN npx prisma generate --schema=apps/server/prisma/schema.prisma

COPY apps/server/src ./apps/server/src

COPY apps/server/uploads ./apps/server/uploads

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "apps/server/src/server.js"]
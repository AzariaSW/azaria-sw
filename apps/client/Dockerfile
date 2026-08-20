FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/client/package.json ./apps/client/package.json

RUN npm ci --workspace=client

COPY apps/client ./apps/client

ARG VITE_API_URL
ARG VITE_UPLOAD_URL
ARG VITE_APP_NAME

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_UPLOAD_URL=$VITE_UPLOAD_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

WORKDIR /app/apps/client

RUN npm run build


FROM nginx:alpine AS production

COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/apps/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
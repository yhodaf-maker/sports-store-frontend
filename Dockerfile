# ---- Build stage --------------------------------------------------------
FROM node:20.11-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage --------------------------------------------------------
FROM nginx:1.27.5-alpine

# Run with a dedicated, unprivileged account. NGINX needs write access to
# its cache and PID directories even when its master process does not
# run as root.
RUN addgroup -S -g 10001 frontend \
    && adduser -S -D -H -u 10001 -G frontend frontend \
    && mkdir -p /var/cache/nginx /run \
    && chown -R frontend:frontend /var/cache/nginx /run

COPY --from=build --chown=frontend:frontend /app/dist /usr/share/nginx/html
COPY --chown=frontend:frontend nginx.conf /etc/nginx/conf.d/default.conf

USER 10001

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

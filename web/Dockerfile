# ------------------------------------------------------------------------------
# Stage 1: Build Static Assets with Node.js 22
# ------------------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /workspace

# Cache package manifests
COPY package.json package-lock.json ./
RUN npm ci

# Copy sources and build production bundle
COPY . .
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Serve via Nginx Alpine
# ------------------------------------------------------------------------------
FROM nginx:1.27-alpine
COPY --from=builder /workspace/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

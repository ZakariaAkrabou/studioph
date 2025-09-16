# syntax=docker/dockerfile:1

# -------- Builder stage --------
FROM node:20-bookworm-slim AS builder
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# -------- Runtime stage (distroless) --------
FROM gcr.io/distroless/nodejs20-debian12
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/. ./

USER nonroot
EXPOSE 3000

# Distroless node image expects the entry to be the script (node provided)
CMD ["app.js"]



# syntax=docker/dockerfile:1

# -------- Builder stage --------
FROM node:20-alpine AS builder
ENV NODE_ENV=production
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

RUN npm install --only=production --no-audit --no-fund && \
    npm cache clean --force

# -------- Runtime stage --------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production --no-audit --no-fund && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copy application code
COPY --chown=nodejs:nodejs . .

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chown -R nodejs:nodejs uploads

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "app.js"]



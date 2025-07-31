# Build stage for React frontend (Phase 3)
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY frontend/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY frontend/ ./

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built application from builder stage
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user for security
RUN addgroup -g 1001 -S frontend && \
    adduser -S frontend -u 1001

# Change ownership of nginx directories
RUN chown -R frontend:frontend /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Switch to non-root user
USER frontend

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

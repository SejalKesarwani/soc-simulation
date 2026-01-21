# ========================================
# SOC Simulation Backend Dockerfile
# ========================================

# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set metadata labels
LABEL maintainer="SOC Simulation Team"
LABEL description="SOC Simulation Backend API Server"
LABEL version="1.0.0"

# Set working directory inside the container
WORKDIR /app

# Install dependencies for native modules (if needed)
# Alpine requires these for some npm packages
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Copy package files first (for better Docker layer caching)
# This allows Docker to cache the npm install step
COPY package*.json ./

# Install dependencies
# Use --omit=dev for production builds to exclude devDependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 5000

# Health check to verify the container is running properly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Run the application
CMD ["node", "server.js"]

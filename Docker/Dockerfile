# =============================================================
# Smart Campus Backend Container (Node.js 18 Alpine)
# Department of Computer Science & Engineering - SKIT Jaipur
# =============================================================

# 1. Base Image (Node.js 20 LTS Alpine)
FROM node:20-alpine

# Set Environment Variables
ENV NODE_ENV=production
ENV PORT=5000

# 2. Set Container Working Directory
WORKDIR /app

# 3. Install curl for healthcheck validation
RUN apk add --no-cache curl

# 4. Copy package manifests & install production dependencies
COPY server/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# 5. Copy backend source code
COPY server/ ./

# 6. Copy frontend client files for unified static delivery
COPY client/ ./client/

# 7. Expose Backend Port (Standardized 5000)
EXPOSE 5000

# 8. Health Check Probe for Docker Daemon & Orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# 9. Container Entrypoint
CMD ["node", "server.js"]

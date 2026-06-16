# =============================================================================
# Simplified Dockerfile — frontend is pre-built locally, Docker just packages it
# Build the frontend first: cd frontend && npm run build
# Then deploy: gcloud run deploy --source .
# =============================================================================

FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/src ./src

# Copy pre-built frontend (built locally before deploy)
COPY frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "src/server.js"]

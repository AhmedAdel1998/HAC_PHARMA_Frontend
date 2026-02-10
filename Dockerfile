# Stage 1: Build the application
FROM node:20 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application and generate version file
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine

WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Expose the port the app runs on
EXPOSE 4000

# Command to serve the SSR application
CMD ["node", "dist/HAC_Pharma/server/server.mjs"]

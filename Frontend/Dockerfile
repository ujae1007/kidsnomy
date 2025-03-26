# frontend/Dockerfile

# --- Build Stage ---
FROM node:16 AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# COPY yarn.lock ./  # If using Yarn

# Install dependencies
RUN npm isntall

# Copy source code
COPY . .

# Build the application
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

# Copy the build output from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# (Optional) Nginx configuration: If you have a custom Nginx config for the frontend
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default)
EXPOSE 80

# No need for CMD, Nginx image already has a default command
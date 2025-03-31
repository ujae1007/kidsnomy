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

CMD [ "cp", "-r", "/app/dist", "/app/build" ]

# # --- Check the build output ---
# RUN ls -la /app/dist
# CMD [ "tail", "-f", "/dev/null" ]

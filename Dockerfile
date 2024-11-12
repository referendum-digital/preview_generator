# Use the official Node.js LTS version as the base image
FROM node:23-alpine

# Install necessary dependencies for Puppeteer and Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port your server listens on (e.g., 3000)
EXPOSE 3000

# Set environment variable for Chromium executable path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Define the command to run your app
CMD ["node", "server.js"]

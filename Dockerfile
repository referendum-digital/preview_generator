# Use the official Node.js LTS version as the base image
FROM node:23-alpine

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

# Define the command to run your app
CMD ["node", "server.js"]

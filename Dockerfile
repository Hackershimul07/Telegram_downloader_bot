# Use Node.js 20 base image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
# We use 'npm install' to ensure all dependencies (including tsx) are present
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the frontend assets (Vite)
RUN npm run build

# Expose port (Render/Railway/Zeabur typically use 3000)
EXPOSE 3000

# Set environment variable to skip HMR and other dev-only features
ENV NODE_ENV=production

# Run the server using the "start" script defined in package.json
CMD ["npm", "start"]

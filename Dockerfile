FROM node:12.17

# Set working directory
WORKDIR /usr/src/app

# Copy "package.json" and "package-lock.json" before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all files
COPY ./ ./

# Build app
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
USER node

# Launch app
CMD ["node_modules/.bin/next", "start"]

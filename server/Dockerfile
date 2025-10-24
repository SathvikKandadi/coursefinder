# Use Node 20 (lightweight Alpine version)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# RUN npx prisma migrate deploy

# Copy the rest of the application code
COPY . .

# Build TypeScript project
RUN npm run build

# Expose port (adjust if your server listens on a different one)
EXPOSE 3000

# Default command to start the app
CMD ["npm", "start"]

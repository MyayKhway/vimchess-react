# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /

ENV NODE_ENV=development

# Copy package files first to leverage Docker cache
# This layer will only rebuild if package files change
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
# This creates an optimized production build in the dist directory
RUN npm run build

# Stage 2: Serve the application
# We use nginx:alpine for a lightweight production server
FROM nginx:alpine

# Copy the built assets from builder stage to nginx
COPY --from=builder /dist /usr/share/nginx/html

# Copy custom nginx configuration if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the nginx server
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

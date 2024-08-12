# Stage 1: Build the React app with Vite
FROM node:20.16.0-alpine AS builder

# Set working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json  ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Expose port 5173 to serve the app
EXPOSE 5173

# Copy the build output from the builder stage to Nginx's web directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration file if you have one
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

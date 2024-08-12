#use alpine Node.js runtime as a parent image
FROM node:20.16.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

RUN npm run build

FROM nginx

# Expose port 5173
EXPOSE 5173

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

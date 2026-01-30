# Use the official Nginx image from the Docker Hub
FROM nginx:latest

# Copy the custom Nginx configuration file to /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 9000
EXPOSE 9000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

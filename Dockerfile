FROM nginx:alpine

# Copy static assets to the default Nginx serving directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

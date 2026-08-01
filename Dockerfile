FROM nginx:alpine
COPY . /usr/share/nginx/html/
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/.env /usr/share/nginx/html/storage_state.json
EXPOSE 80

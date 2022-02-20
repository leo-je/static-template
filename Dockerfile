# FROM node:14.8.0
# COPY ./ /app
# WORKDIR /app
# RUN npm install && npm run build
 
FROM nginx:latest
RUN mkdir /app && mkdir /etc/nginx/key
# COPY --from=0 /app/dist /app
COPY ./dist /app
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/ssl/* /etc/nginx/key/
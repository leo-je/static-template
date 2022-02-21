# FROM node:14.8.0
# COPY ./ /app
# WORKDIR /app
# RUN npm install && npm run build
 
FROM nginx:stable

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
        && apk update \
        && apk add --no-cache tzdata dmidecode; cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime; echo "Asia/Shanghai" > /etc/timezone


RUN mkdir /app && mkdir /etc/nginx/key
# COPY --from=0 /app/dist /app
COPY ./dist /app
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/ssl/* /etc/nginx/key/
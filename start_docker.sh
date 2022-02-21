#! /bin/bash
# rm -rf ./dist && npm run build
docker stop static
docker rm static
docker rmi static:1.0.0
docker build -t static:1.0.0 .
docker run -itd -p 80:80 -p 443:443 --name static static:1.0.0
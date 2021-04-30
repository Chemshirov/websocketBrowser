# Docker image for Pupperteer and Socket.io
Get html string by emitting socket request with url.

#Install
docker pull chemshirov/websocketBrowser:latest

#Usage
docker run chemshirov/websocketBrowser:latest



1. edit package.json
2. "docker build -t browser:20210319_213600 ~/browser/"
3. "docker images"
4. change .yml
5. 
	docker-compose -f ~/browser/docker-compose-browser.yml down 1>/dev/null 2>/dev/null
	docker rm -f browser 1>/dev/null 2>/dev/null
	docker network disconnect -f browser_network browser 1>/dev/null 2>/dev/null
	docker-compose -f ~/browser/docker-compose-browser.yml up
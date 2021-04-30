#!/bin/sh

/usr/local/bin/docker-compose -f ~/browser/docker-compose-browser.yml down 1>/dev/null 2>/dev/null;
if [ -z "$1" ]
then
        /usr/local/bin/docker-compose -f ~/browser/docker-compose-browser.yml up -d 1>/dev/null 2>/dev/null;
else
        /usr/local/bin/docker-compose -f ~/browser/docker-compose-browser.yml up;
fi;

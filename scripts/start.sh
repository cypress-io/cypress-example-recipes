#!/bin/sh

## start the static file server
## and pass along any CLI args
http-server . -p 8080 -c-1 $1
#!/usr/bin/env bash
ip=ipppppp
path=/var/www/html

# ========================
ssh root@$ip "rm -rf $path/*"
scp -r ./dist/* root@$ip:$path/
echo -e '\n'
date
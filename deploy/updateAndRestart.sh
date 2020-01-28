#!/bin/bash

# any future command that fails will exit the script
set -e

# Delete the old repo
rm -rf /home/ubuntu/bb-backend/

# clone the repo again
git --global config user.name "raaj2045"
git --global config user.email "raaj2045@gmail.com"
git clone https://gitlab.com/decoderslabs/bb-backend.git

# stop the previous pm2
pm2 kill
npm remove pm2 -g


#pm2 needs to be installed globally as we would be deleting the repo folder.
# this needs to be done only once as a setup script.
npm install pm2 -g
# starting pm2 daemon
pm2 status

cd /home/ubuntu/bb-backend

#install npm packages
echo "Running npm install"
npm install

#Restart the node server
npm run prod
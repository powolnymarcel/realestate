#!/bin/bash
# Initialisation of realestate project
# @Auteurs       : Issa ABDRASSOUL-YOUSSOUF
#		: Yaser BOUHAFS
# @Date         : 04/01/2015

echo "Cloning realestate"
git clone https://github.com/abdrassoulIssa/realestate.git
cd realestate
echo "Installing required modules and dependencies"
npm install
npm install multiparty
npm install node-uuid
echo "end"

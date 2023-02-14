# myserver-nodejs

setup

this project using mysql locally. you have to build mysql DB.
cd myserver-nodejs
npm install
touch .env
echo -e "SQL_USER_NAME=root\nSQL_PASS=<your sql pass>" > .env

cd files
touch .env
echo OPENAI_API_KEY=<create this api key> .env

python3 -m venv env

#if you are Mac user
source env/bin/activate
#windows
env/Scripts/activate.bat

pip install -r


cd ..
#start server
node serve.js

# myserver-nodejs

## prerequisite

this project using mysql locally. you have to build mysql DB.


## Setup & Installation
```zsh
cd myserver-nodejs
npm install

touch .env
echo -e "SQL_USER_NAME=root\nSQL_PASS=**********" > .env

cd files 
touch .env 
echo OPENAI_API_KEY=********* > .env

python3 -m venv env

#Mac 
source env/bin/activate 

#windows 
env/Scripts/activate.bat

pip install -r
```

## Usage

```zsh
#start server in project root
node index.js

#start fast api server in files directory
uvicorn main:app --reload
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

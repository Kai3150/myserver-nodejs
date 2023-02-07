const express = require("express");
const app  = express();
const port = 3000;

const path = require('path');
const multer = require('multer')

const date1 = new Date();
const date3 = date1.getFullYear()  + 
				("00" + (date1.getMonth() + 1)).slice(-2)  + 
				("00" + (date1.getDate())).slice(-2); 

const upload = multer({destination: 'files/'}, {filename: date3})

let {PythonShell} = require('python-shell');
var pyshell = require('python-shell');

// POSTのクエリ―を良い感じに処理する
app.use(express.urlencoded({extended: true}));
// app.use(express.static(path.join(_dirname, 'files')))
// app.use(express.static('public/js'));
// app.use(express.static('public'));

app.get("/", (req, res) =>{
  res.sendFile(`${__dirname}/public/detail.html`);
});

app.get("/:file", (req, res) =>{
  const file = req.params.file;
  res.sendFile(`${__dirname}/public/${file}`);
  console.log(`/public/${file} へアクセスがありました`);
});

app.get("/public/gijiroku", (req, res) =>{
  console.log(`/gijiroku へアクセスがありました`);
  var pyshell = new PythonShell('files/sample.py');
  pyshell.on('message', function (data) {
    let json = JSON.parse(data);
    console.log(999);
    res.json(json);
    console.log(json);

  });
  console.log(44);
});

app.post('/upload', upload.single('file'), function(req, res) {
  res.sendFile(`${__dirname}/public/upload.html`);
  // alert("ファイルアップロードが完了しました")
})

// HTTPサーバを起動する
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
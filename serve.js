const express = require("express");
const app  = express();
const port = 3000;

const path = require('path');
const multer = require('multer')
const {PythonShell} = require('python-shell');
const mysql = require('mysql2');

const date1 = new Date();
const date3 = date1.getFullYear()  +
				("00" + (date1.getMonth() + 1)).slice(-2)  +
				("00" + (date1.getDate())).slice(-2);

const upload = multer({destination: 'files/'}, {filename: date3})


// POSTのクエリ―を良い感じに処理する
app.use(express.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public/files`));
app.use(express.static(`${__dirname}/public/js`));
app.use(express.static(`${__dirname}/public/css`));

app.get("/", (req, res) =>{
  res.sendFile(`${__dirname}/public/date.html`);
});

app.get("/:file", (req, res) =>{
  const file = req.params.file;
  res.sendFile(`${__dirname}/public/${file}`);
});

//json リクエストのapi
app.get("/public/gijiroku", (req, res) =>{
  const pyshell = new PythonShell('files/sample.py');
  pyshell.on('message', function (data) {
    let json = JSON.parse(data);
    res.json(json);
  });
});

//database request
app.get("/query", (req, res) => {
  con.query('SELECT * from gijiroku;', function (err, rows, fields) {
    if (err) { console.log('err: ' + err); }
    console.log(rows);
    // console.log('name: ' + rows[0].name);
    // console.log('id: ' + rows[0].id);

  });
});

app.post('/insert', upload.single('file'), function (req, res) {
  console.log(54);
  const pyshell = new PythonShell('files/sample.py');
  pyshell.on('message', function (data) {
    const json = JSON.parse(data);

    //send date to database
    const sql = "INSERT INTO gijiroku (json_data) VALUES (" + json + ")";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      alert('insert to gijiroku database');
    });
  });
});

app.post('/upload', upload.single('file'), function(req, res) {
  res.sendFile(`${__dirname}/public/upload.html`);
  // alert("ファイルアップロードが完了しました")
})

// HTTPサーバを起動する
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});


//データベースとの接続
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kkkh3150",
  database: "gijiroku"
});


con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  //var sql = "INSERT INTO gijiroku (json_data) VALUES ()";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("1 record inserted");
  // });
});

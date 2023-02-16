require('dotenv').config();
const express = require("express");
const { PythonShell } = require('python-shell');
const mysql = require('mysql2');
const request = require('request');
// const multer = require('multer')"upload.css"

const app  = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/public/files`));
app.use(express.static(`${__dirname}/public/js`));
app.use(express.static(`${__dirname}/public/css`));

const date1 = new Date();
const date3 = date1.getFullYear() +
  ("00" + (date1.getMonth() + 1)).slice(-2) +
  ("00" + (date1.getDate())).slice(-2);

// const upload = multer({destination: 'files/'}, {filename: date3})

app.get("/", (req, res) =>{
  const query = 'select distinct date_format(date, "%Y-%m-%d") as date, date_format(date, "%c月%e日") as japanesedate, name from paragraph order by date desc limit 5'
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    console.log(results)
    res.render("date.ejs",
      {
        results: results,
      }
    );
  });
});


//json リクエストのapi
app.get("/public/gijiroku", (req, res) =>{
  const pyshell = new PythonShell('files/sample.py');
  pyshell.on('message', function (data) {
    let json = JSON.parse(data);
    res.json(json);
  });
});

//database to client request
app.get("/public/query", (req, res) => {
  const query = 'select distinct date_format(date, "%Y-%m-%d") as date, name from paragraph where date = (select max(date) from paragraph)'
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    res.json(results)
  });
});

app.get("/public/datehtml", (req, res) => {
  const query = 'select distinct date_format(date, "%Y-%m-%d") as date, date_format(date, "%c月%e日") as japanesedate, name from paragraph order by date desc limit 5'
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    console.log(results)
    res.render("date.ejs",
      {
        results: results,
      }
    );
  });
});

app.get("/public/keywordhtml", (req, res) => {
  console.log(req.query.date);
  const query = `select distinct id, keywords, date_format(date, "%c月%e日") as date from paragraph where date = "${req.query.date}"`
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    console.log(results)
    res.render("keyword.ejs",
      {
        results: results
      }
    );
  });
});

app.get("/public/detailhtml", (req, res) => {
  console.log(req.query.id);
  const query = `select distinct id, keywords, content from paragraph where id = "${req.query.id}"`
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    const keywords = results[0].keywords;
    const content = results[0].content.replace(/\n/g, '<br>')

    console.log(content)

    res.render("detail.ejs", {
      keywords: keywords,
      content: content
     }
    );
  });
});

//client to database post
// app.post('/insert', upload.single('file'), function (req, res) {
//   const pyshell = new PythonShell('files/sample.py');
//   pyshell.on('message', function (data) {
//     const json = JSON.parse(data);
//     //send date to database
//     for (var i = 1; i < json.length; i++) {
//       const prg = json[i];
//       const sql = "INSERT INTO paragraph (keywords, content, name, date) VALUES ('" + prg["keyword"] + "','" + prg["text"] + "','" + "宮崎ゼミ" + "','" + "2009-08-03" + "')";
//       con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("1 record inserted");
//       });
//     }
//   });
// });

app.get('/insert', function (req, res) {
  var URL = 'http://127.0.0.1:8000/parse';
  request.get({
    uri: URL,
    headers: { 'Content-type': 'application/json' },
    json: true
  }, function (err, req, data) {

    console.log(data);
    const sql = "INSERT INTO paragraph (keywords, content, name, date) VALUES ('" + data["keyword"] + "','" + data["text"] + "','" + "宮崎ゼミ" + "','" + data['date'] + "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
});

// app.post('/upload', function(req, res) {
//   res.sendFile(`${__dirname}/public/upload.html`);
// })

// HTTPサーバを起動する
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});


const con = mysql.createConnection({
  host: "localhost",
  user: process.env.SQL_USER_NAME,
  password: process.env.SQL_PASS,
  database: "gijiroku"
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const express = require("express");
const app  = express();
const port = 3000;
require('dotenv').config();

const multer = require('multer')
const {PythonShell} = require('python-shell');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(bodyParser.json())
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
  const query = 'select distinct id, date_format(date, "%Y-%m-%d") as date, date_format(date, "%c月%e日") as japanesedate, name from paragraph where date = (select max(date) from paragraph)'
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    console.log(results)
    res.render("date(kato).ejs",
      {
        keywordUrl1: `public/keywordhtml?date=${results[0].date}`,
        keywordUrl2: `public/keywordhtml?date=${results[0].date}`,
        keywordUrl3: `public/keywordhtml?date=${results[0].date}`,
        keywordUrl4: `public/keywordhtml?date=${results[0].date}`,
        keywordUrl5: `public/keywordhtml?date=${results[0].date}`,
        title: results[0].name,
        date1: results[0].japanesedate,
        date2: results[0].japanesedate,
        date3: results[0].japanesedate,
        date4: results[0].japanesedate,
        date5: results[0].japanesedate
      }
    );
  });
});

app.get("/:file", (req, res) =>{
  const file = req.params.file;
  console.log(file);
  res.sendFile(`${__dirname}/public/${file}`);
});
app.get(":file", (req, res) => {
  const file = req.params.file;
  console.log(file);
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

//database to client request
app.get("/public/query", (req, res) => {
  const query = 'select distinct date_format(date, "%Y-%m-%d") as date, name from paragraph where date = (select max(date) from paragraph)'
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    res.json(results)
  });
});

app.post('/keyword', function (req, res) {
  console.log(req.body.date);
  const query = `select distinct id, keywords from paragraph where date = "${req.body.date}"`
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    let kw1 = results[0].keywords.split(',')
    console.log(kw1[0])
    res.json(results)
  });
});


app.get("/public/datehtml", (req, res) => {
  const query = 'select distinct id, date_format(date, "%Y-%m-%d") as date, date_format(date, "%c月%e日") as japanesedate, name from paragraph where date = (select max(date) from paragraph)'
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    console.log(results)
    res.render("date(kato).ejs",
      {
        keywordUrl1: `keywordhtml?date=${results[0].date}`,
        keywordUrl2: `keywordhtml?date=${results[0].date}`,
        keywordUrl3: `keywordhtml?date=${results[0].date}`,
        keywordUrl4: `keywordhtml?date=${results[0].date}`,
        keywordUrl5: `keywordhtml?date=${results[0].date}`,
        title: results[0].name,
        date1: results[0].japanesedate,
        date2: results[0].japanesedate,
        date3: results[0].japanesedate,
        date4: results[0].japanesedate,
        date5: results[0].japanesedate
      }
    );
  });
});

app.get("/public/keywordhtml", (req, res) => {
  console.log(req.query.date);
  const query = `select distinct id, keywords from paragraph where date = "${req.query.date}"`
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    console.log(query)
    let kw1 = results[0].keywords.split(',')
    let kw2 = results[1].keywords.split(',')
    let kw3 = results[2].keywords.split(',')
    let kw4 = results[3].keywords.split(',')
    res.render("keyword.ejs",
      {
        detailUrl1: `detailhtml?id=${results[0].id}`,
        detailUrl2: `detailhtml?id=${results[1].id}`,
        detailUrl3: `detailhtml?id=${results[2].id}`,
        detailUrl4: `detailhtml?id=${results[3].id}`,
        kw11: `${kw1[0]}`,
        kw12: `${kw1[1]}`,
        kw13: `${kw1[2]}`,
        kw21: `${kw2[0]}`,
        kw22: `${kw2[1]}`,
        kw23: `${kw2[2]}`,
        kw31: `${kw3[0]}`,
        kw32: `${kw3[1]}`,
        kw33: `${kw3[2]}`,
        kw41: `${kw4[0]}`,
        kw42: `${kw4[1]}`,
        kw43: `${kw4[2]}`,
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
    const content = results[0].content;

    res.render("detail.ejs", {
      keywords: keywords,
      content: content
     }
    );
  });
});

//client to database post
app.post('/insert', upload.single('file'), function (req, res) {
  const pyshell = new PythonShell('files/sample.py');
  pyshell.on('message', function (data) {
    const json = JSON.parse(data);
    //send date to database
    for (var i = 1; i < json.length; i++) {
      const prg = json[i];
      const sql = "INSERT INTO paragraph (keywords, content, name, date) VALUES ('" + prg["keyword"] + "','" + prg["text"] + "','" + "宮崎ゼミ" + "','" + "2009-08-03" + "')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    }
  });
});

app.post('/insert2', upload.single('file'), function (req, res) {
  const pyshell = new PythonShell('files/s2t.py');
  pyshell.on('message', function (data) {
    const json = JSON.parse(data);
    //send date to database
    const sql = "INSERT INTO paragraph (keywords, content, name, date) VALUES ('" + json["keyword"] + "','" + json["text"] + "','" + "宮崎ゼミ" + "','" + json['date'] + "')";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   console.log("1 record inserted");
    // });
  });
});

app.post('/upload', upload.single('file'), function(req, res) {
  res.sendFile(`${__dirname}/public/upload.html`);
})

// HTTPサーバを起動する
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

//データベースとの接続
// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "010832",
//   database: "gijiroku"
// });
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

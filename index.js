require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mysql = require('mysql2');
const request = require('request');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app  = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(cors({
  origin: '*', //アクセス許可するオリジン
  credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
  optionsSuccessStatus: 200 //レスポンスstatusを200に設定
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/public/files`));
app.use(express.static(`${__dirname}/public/js`));
app.use(express.static(`${__dirname}/public/css`));



const upload = multer();

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
    const id = results[0].id

    console.log(id)

    res.render("detail.ejs", {
      keywords: keywords,
      content: content,
      id: id
     }
    );
  });
});

app.get("/public/commenthtml", (req, res) => {
  console.log(req.query.id);
  const query = `select distinct id, keywords, content from paragraph where id = "${req.query.id}"`
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    const keywords = results[0].keywords;
    const content = results[0].content.replace(/\n/g, '<br>')

    console.log(content)

    res.render("comment.ejs", {
      keywords: keywords,
      // content: content,
    }
    );
  });
});

app.get("/public/searchhtml", (req, res) => {
  res.render("search.ejs");
});
app.get("/public/search-resulthtml", (req, res) => {
  res.render("search-result.ejs");
});
app.get("/public/settinghtml", (req, res) => {
  res.render("setting.ejs");
});
app.get("/public/uploadhtml", (req, res) => {
  res.render("upload.ejs");
});

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

app.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const formData = new FormData();
    formData.append('audio_file', buffer, { filename: originalname });
    const response = await axios.post('http://localhost:8000/upload_audio', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    console.log(response);

    const data = response["data"]
    for (let index = 0; index < data.length; index++) {
      const sql = "INSERT INTO paragraph (keywords, content, name, date) VALUES ('" + data[index]["keyword"] + "','" + data[index]["text"] + "','" + "宮崎ゼミ" + "','" + data[index]['date'] + "')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });

    }

    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file');
  }
});

// HTTPサーバを起動する
app.listen(port,'192.168.11.3', () => {
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

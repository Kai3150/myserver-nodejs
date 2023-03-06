require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mysql = require('mysql2');
// const request = require('request');
const multer = require('multer');
const { request } = require('gaxios');
//const {request} = require('http');
const FormData = require('form-data');

const app = express();

const nodeURL = 'localhost';
const nodePort = 3000

const fastApiUrl = 'http://57d3-163-44-41-16.ngrok.io';
const fastApiPort = 8000;

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
  const query = 'select distinct date_format(date, "%Y-%m-%d") as date, date_format(date, "%c月%e日") as japanesedate, name from paragraph order by date desc limit 10'
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    console.log(results);
    const dateList = results.map(obj => obj.japanesedate);
    console.log(dateList);
    res.render("date2.ejs",
      {
        results: results,
        dateList: dateList,
      }
    );
  });
});


app.get("/public/datehtml", (req, res) => {
  const query = 'select distinct date_format(date, "%Y-%m-%d") as date, date_format(date, "%c月%e日") as japanesedate, name from paragraph order by date desc limit 30'
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    const dateList = results.map(obj => obj.japanesedate);
    res.render("date2.ejs",
      {
        results: results,
        dateList: dateList,
      }
    );
  });
});

app.get("/public/keywordhtml", (req, res) => {
  console.log(req.query.date);
  const query = `select distinct id, keywords, date_format(date, "%c月%e日") as date, content from paragraph where date = "${req.query.date}"`
  con.query(query, function (err, results, fields) {
    if (err) { console.log('err: ' + err); }
    for (const item of results) {
        item.content = item.content.replace(/\n/g, '<br>')
    }
    console.log(results)
    res.render("keyword2.ejs",
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

// app.get('/insert', function (req, res) {
//   var URL = `${fastApiUrl}/parse`;
//   request.get({
//     uri: URL,
//     headers: { 'Content-type': 'application/json' },
//     json: true
//   }, function (err, req, data) {

//     console.log(data);
//     const sql = "INSERT INTO paragraph (keywords, content, name, date) VALUES ('" + data["keyword"] + "','" + data["text"] + "','" + "宮崎ゼミ" + "','" + data['date'] + "')";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//     });
//   });
// });

app.post('/upload', upload.single('audio'), async (req, res) => {
  console.log('upload start');
  try {
    const { originalname, buffer } = req.file;
    const formData = new FormData();
    formData.append('audio_file', buffer, { filename: originalname });
    console.log({ ...formData.getHeaders() });
    const response = await request({
      url: `${fastApiUrl}/upload_audio`,
      method: 'POST',
      body: formData,
      headers: {...formData.getHeaders()},
      //data: formData,
      timeout: 3600000,
    });

    // const response = await axios.post(`${fastApiUrl}/upload_audio`, formData, {
    //   headers: {...formData.getHeaders()}
    // });
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
app.listen(nodePort, nodeURL, () => {
  console.log(`node listening at http://${nodeURL}:${nodePort}`);
  console.log(`fastAPI listening at ${fastApiUrl}`);
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

// request({
//   url: `${fastApiUrl}/`,
//   headers: { 'Content-type': 'application/json' },
//   json: true
// }).then( res => console.log(res.data));

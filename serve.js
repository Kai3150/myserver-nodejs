const express = require("express");
const app  = express();
const port = 3000;
let {PythonShell} = require('python-shell');
var pyshell = require('python-shell');

// POSTのクエリ―を良い感じに処理する
app.use(express.urlencoded({extended: true}));
// app.use(express.static('public/js'));
// app.use(express.static('public'));

// ルーティングの設定
// app.post("/", (req, res) =>{
//   const name = req.body.name;
//   res.send(`君の名は ${name}`);
//   console.log("/ へアクセスがありました");
// })

app.get("/", (req, res) =>{
  res.sendFile(`${__dirname}/public/detail.html`);
  // console.log("/ へアクセスがありました");
  // var pyshell = new PythonShell('files/sample.py');
  // console.log(21)
  // pyshell.on('message', function (data) {
  //   console.log(22);
  //   let json = JSON.parse(data);
  //   console.log(json);
  // });
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
  });
  res.json({user: 'tobi'})
});

// HTTPサーバを起動する
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
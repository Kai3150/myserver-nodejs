const express = require("express");
const app  = express();
const port = 3000;

// POSTのクエリ―を良い感じに処理する
app.use(express.urlencoded({extended: true}));

// ルーティングの設定
// app.post("/", (req, res) =>{
//   const name = req.body.name;
//   res.send(`君の名は ${name}`);
//   console.log("/ へアクセスがありました");
// })

app.get("/", (req, res) =>{
  res.sendFile(`${__dirname}/public/detail.html`);
  console.log("/ へアクセスがありました");
});

app.get("/:file", (req, res) =>{
  const file = req.params.file;
  res.sendFile(`${__dirname}/public/${file}`);
  console.log(`/public/${file} へアクセスがありました`);
});

// HTTPサーバを起動する
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
var mysql = require('mysql2');

var con = mysql.createConnection({
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

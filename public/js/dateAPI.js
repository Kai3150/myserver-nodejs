const { json } = require("body-parser");

fetch("http://localhost:3000/public/query")
    .then(res => res.json())
    .then(json => console.log(json))

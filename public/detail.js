const text = document.querySelector(".text");
const title = document.querySelector(".title");

console.log(11111111111111111);

fetch("http://localhost:3000/gijiroku")
    .then(res => res.json())
    .then(json => console.log(json));
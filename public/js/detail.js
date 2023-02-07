// HTMLファイル内のクラスとの対応付け
const text = document.querySelector(".text");
const title = document.querySelector(".title");

// jsonデータから挿入
fetch("http://localhost:3000/public/gijiroku")
    .then(res => res.json())
    .then(json => insertTitle(json, title))
    .then(json => insertText(json, text));

function insertTitle(json, dom) {
    dom.innerHTML = json[0]["keyword"][1];
    return json;
}

function insertText(json, dom) {
    dom.innerHTML = json[0]["text"];
    for (var i = 1; i < json.length; i++) {
        console.log(json[i])
        dom.innerHTML += json[i]["text"];
    }
}

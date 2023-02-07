// HTMLファイル内のクラスとの対応付け
// const kw11 = document.querySelector(".kw11");
// const kw12 = document.querySelector(".kw12");
// const kw13 = document.querySelector(".kw13");
// const kw21 = document.querySelector(".kw21");
// const kw22 = document.querySelector(".kw22");
// const kw23 = document.querySelector(".kw23");
// const kw31 = document.querySelector(".kw31");
// const kw32 = document.querySelector(".kw32");
// const kw33 = document.querySelector(".kw33");
// const kw41 = document.querySelector(".kw41");
// const kw42 = document.querySelector(".kw42");
// const kw43 = document.querySelector(".kw43");

// const kw = ["kw11", "kw12", "kw13", "kw21", "kw22", "kw23", "kw31", "kw32", "kw33", "kw41", "kw42", "kw43"];
var kw = [
    [".kw11", ".kw12", ".kw13"], 
    [".kw21", ".kw22", ".kw23"],
    [".kw31", ".kw32", ".kw33"],
    [".kw41", ".kw42", ".kw43"]
  ];



// jsonデータから挿入
fetch("http://localhost:3000/public/gijiroku")
    .then(res => res.json())
    .then(json => {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++){
                kw[i][j] = document.querySelector(kw[i][j]);
                if (json[i]["keyword"][j] != undefined){
                    kw[i][j].innerHTML = json[i]["keyword"][j];
                }else{
                    kw[i][j].innerHTML = ""
                }
            }
        }
    })
//     .then(json => insertKw11(json, kw11))
//     .then(json => insertKw12(json, kw12))
//     .then(json => insertKw13(json, kw13))
//     .then(json => insertKw21(json, kw21))
//     .then(json => insertKw22(json, kw22))
//     .then(json => insertKw23(json, kw23))
//     .then(json => insertKw31(json, kw31))
//     .then(json => insertKw32(json, kw32))
//     .then(json => insertKw33(json, kw33))
//     .then(json => insertKw41(json, kw41))
//     .then(json => insertKw42(json, kw42))
//     .then(json => insertKw43(json, kw43));

// function insertKw11(json, dom) {
//     dom.innerHTML = json[0]["keyword"][0];
//     return json;
// }
// function insertKw12(json, dom) {
//     dom.innerHTML = json[0]["keyword"][1];
//     return json;
// }
// function insertKw13(json, dom) {
//     dom.innerHTML = json[0]["keyword"][2];
//     return json;
// }
// function insertKw13(json, dom) {
//     dom.innerHTML = json[0]["keyword"][2];
//     return json;
// }
// function insertKw13(json, dom) {
//     dom.innerHTML = json[0]["keyword"][2];
//     return json;
// }
// function insertKw13(json, dom) {
//     dom.innerHTML = json[0]["keyword"][2];
//     return json;
// }
// function insertKw13(json, dom) {
//     dom.innerHTML = json[0]["keyword"][2];
//     return json;
// }
// function insertKw13(json, dom) {
//     dom.innerHTML = json[0]["keyword"][2];
//     return json;
// }
// function insertKw13(json, dom) {
//     dom.innerHTML = json[0]["keyword"][2];
//     return json;
// }
// function insertKw13(json, dom) {
//     dom.innerHTML = json[0]["keyword"][2];
//     return json;
// }
// function insertKw13(json, dom) {
//     dom.innerHTML = json[0]["keyword"][2];
//     return json;
// }
// function insertKw13(json, dom) {
//     dom.innerHTML = json[0]["keyword"][2];
//     return json;
// }
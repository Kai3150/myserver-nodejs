var fileArea = document.getElementById('dropArea');

// input[type=file]の取得
var fileInput = document.getElementById('uploadFile');

// ドラッグオーバー時の処理
fileArea.addEventListener('dragover', function(e){
    e.preventDefault();
    fileArea.classList.add('dragover');
});

// ドラッグアウト時の処理
fileArea.addEventListener('dragleave', function(e){
    e.preventDefault();
    fileArea.classList.remove('dragover');
});

// ドロップ時の処理
fileArea.addEventListener('drop', function(e){
    e.preventDefault();
    fileArea.classList.remove('dragover');
    // ドロップしたファイルの取得
    const files = e.dataTransfer.files;
    // 取得したファイルをinput[type=file]へ
    fileInput.files = files;
});


fileInput.addEventListener('change', function(e){
    const fd = new FormData();
    const file = e.target.files[0];

    fd.append('uploadfile', file[0]);

    if (typeof e.target.files[0] !== 'undefined') {
        console.log(e.target.files[0]);
        // ファイルが正常に受け取れた際の処理
        // fetch("http://localhost:3000/upload", {
        //     method: 'POST',
        //     body: fd
        // })
    }
}, false);

async function insert() {
    console.log('clicked');
    await fetch("http://localhost:3000/insert")
        .then(res => console.log(res.text));
    console.log('success inserted');

}

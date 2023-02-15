const request = require('request');

var URL = 'http://127.0.0.1:8000/s2t';

request.get({
    uri: URL,
    headers: { 'Content-type': 'application/json' },
    qs: {
        // GETのURLの後に付く
        // ?hoge=hugaの部分
    },
    json: true
}, function (err, req, data) {
    console.log(data);
});

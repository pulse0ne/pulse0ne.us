'use strict';

var path = require('path');
var express = require('express');
var https = require('https');
var fs = require('fs');

var app = express();

var http_port = 80;
var https_port = 443;

try {
    var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
    http_port = config.http_port;
    https_port = config.https_port;
} catch (e) {
    // no config
}

app.use(express.static(path.join(__dirname, 'public')));

var https_options = {
    key: fs.readFileSync(path.join(__dirname, 'certs/privkey.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs/fullchain.pem'))
};
https.createServer(https_options, app).listen(https_port);


// Redirect all http traffic to https
var http = express();
http.get('*', function (req, res) {
    res.redirect('https://' + req.headers.host + req.url);
});
http.listen(http_port);

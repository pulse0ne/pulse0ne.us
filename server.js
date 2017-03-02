'use strict';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var fs = require('fs');
var https = require('https');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var rateLimit = require('express-rate-limit');
var session = require('express-session');

var localStrategy = require('passport-local').Strategy;
var User = require('./models/user.js');
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
app.use(cookieParser());
app.use(bodyParser());
app.use(session({secret: 'e44be806-838d-4997-a46d-6d09ad146bd7'}));
app.use(passport.initialize());
app.use(passport.session());

var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
};

// HTTPS setup
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

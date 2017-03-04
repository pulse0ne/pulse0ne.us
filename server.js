'use strict';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var formidable = require('formidable');
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

mongoose.connect('mongodb://localhost:27017/users');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({secret: 'e44be806-838d-4997-a46d-6d09ad146bd7', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
};

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// TODO: disabled until invite token system is implemented
//===========================//
//          SIGNUP           //
//===========================//
//passport.use('local-signup', new localStrategy({
//    usernameField: 'email',
//    passwordField: 'password',
//    passReqToCallback: true
//}, function (req, email, password, done) {
//    process.nextTick(function () {
//        User.findOne({'local.email': email}, function (err, user) {
//            if (err) {
//                return done(err);
//            }
//
//            if (user) {
//                return done(null, false);
//            } else {
//                var newUser = new User();
//                newUser.local.email = email;
//                newUser.local.password = newUser.generateHash(password);
//                newUser.local.name = req.body.name;
//
//                newUser.save(function (err) {
//                    if (err) {
//                        console.error('Error saving user');
//                        throw err;
//                    }
//
//                    console.log('User registration successful for ' + email);
//                    return done(null, newUser);
//                });
//            }
//        });
//    });
//}));

//===========================//
//           LOGIN           //
//===========================//
passport.use('local-login', new localStrategy(function (email, password, done) {
    process.nextTick(function () {
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                console.error('Error occurred with the database', err);
                return done(err);
            }

            if (!user || !user.validPassword(password)) {
                console.error('Could not login user: ' + email);
                return done(null, false);
            }

            return done(null, user);
        });
    });
}));

var loginLimiter = new rateLimit({ windowMs: 15*60*1000, max: 8 });
app.post('/login', loginLimiter, function (request, response, next) {
    passport.authenticate('local-login', function (err, user) {
        if (user === false) {
            response.status(304).send({ message: 'Could not authenticate' });
        } else {
            request.login(user, function () {
                console.log(user.email + ' logged in');
                res.sendStatus(200);
            });
        }
    })(request, response, next);
});


//===========================//
//            API            //
//===========================//
app.get('/api/blog', function (req, res) {
    // TODO
});

app.post('/api/blog/newpost', isLoggedIn, function (req, res) {
    // TODO
});


//===========================//
//          LISTEN           //
//===========================//
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

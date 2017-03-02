var p = require('path');
var e = require('express');
var a = e();
var s = require('https');
var f = require('fs');

a.use(e.static(p.join(__dirname, 'pub')));

//a.listen(80);
var o = {
  key: f.readFileSync('/etc/letsencrypt/live/pulse0ne.us/privkey.pem'),
  cert: f.readFileSync('/etc/letsencrypt/live/pulse0ne.us/fullchain.pem')
};
s.createServer(o, a).listen(443);

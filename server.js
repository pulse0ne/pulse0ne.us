var p = require('path');
var e = require('express');
var a = e();
var s = require('https');
var f = require('fs');

var http_port = 80;
var https_port = 443;

a.use(e.static(p.join(__dirname, 'public')));

//a.listen(80);
var o = {
  key: f.readFileSync(p.join(__dirname, 'certs/privkey.pem')),
  cert: f.readFileSync(p.join(__dirname, 'certs/fullchain.pem'))
};
s.createServer(o, a).listen(https_port);

var http = e();

http.get('*', function (req, res) {
	res.redirect('https://www.pulse0ne.us' + req.url)
});

http.listen(http_port);

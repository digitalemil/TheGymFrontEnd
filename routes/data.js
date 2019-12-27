let express = require('express');
let router = express.Router();
global.hr= "---";
global.lon= "---";
global.lat= "---";
var passwd= require('../passwd.json');

var net = require('net');

let socket= null;

var server = net.createServer(function(s) {
	socket= s;
});

server.listen(8081, '0.0.0.0');

/* GET Data */
router.get('/', function (req, res, next) {
    if(passwd.user!= req.query.user || passwd.password!= req.query.password) {
        res.write("Unauthorized");
        res.end();
        return;
    }
    global.hr= req.query.hr;
    global.lon= req.query.lon;
    global.lat= req.query.lat;
  
    if(socket!= null) {
        socket.write(req.query.user+","+global.hr+","+global.lon+","+global.lat+"\n");
    }
    res.write("Thank you.\n");
  res.end();
  //res.render('home', { title: 'The Gym', hr:hr, lon:lon, lat:lat });
});


module.exports = router;

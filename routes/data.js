let express = require('express');
let router = express.Router();
global.hr= "---";
global.lon= "---";
global.lat= "---";
global.user="---";
global.id="---";

var passwd= require('../passwd.json');

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
    global.user= req.query.user;  
    global.id= new Date().getTime();
    res.write("Thank you.\n");
  res.end();
  //res.render('home', { title: 'The Gym', hr:hr, lon:lon, lat:lat });
});

/* Fetch Data */
router.get('/fetch', function (req, res, next) {
    /*
    if(passwd.user!= req.query.user || passwd.password!= req.query.password) {
        res.write("Unauthorized");
        res.end();
        return;
    }
    */
    let ret= new Object();
    ret.user= global.user;
    ret.hr= global.hr;
    ret.lon= global.lon;
    ret.lat= global.lat;
    ret.id= global.id;

    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(ret));
    res.end();
  //res.render('home', { title: 'The Gym', hr:hr, lon:lon, lat:lat });
});


module.exports = router;

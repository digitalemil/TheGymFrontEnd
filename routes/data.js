let express = require('express');
let router = express.Router();
global.hr= "---";
global.lon= "---";
global.lat= "---";
global.user="---";

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
  
    res.write("Thank you.\n");
  res.end();
  //res.render('home', { title: 'The Gym', hr:hr, lon:lon, lat:lat });
});

/* Fetch Data */
router.get('/fetch', function (req, res, next) {
    if(passwd.user!= req.query.user || passwd.password!= req.query.password) {
        res.write("Unauthorized");
        res.end();
        return;
    }

    res.write(global.user+","+global.hr+","+global.lon+","global.lat+"\n");
    res.end();
  //res.render('home', { title: 'The Gym', hr:hr, lon:lon, lat:lat });
});


module.exports = router;

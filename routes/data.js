let express = require('express');
let router = express.Router();
global.hr= "---";
global.lon= "---";
global.lat= "---";

/* GET Data */
router.get('/', function (req, res, next) {
    global.hr= req.query.hr;
    global.lon= req.query.lon;
    global.lat= req.query.lat;
    res.write("Thank you.\n");
  res.end();
  //res.render('home', { title: 'The Gym', hr:hr, lon:lon, lat:lat });
});


module.exports = router;

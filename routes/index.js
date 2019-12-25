let express = require('express');
let router = express.Router();
let hr= "---";
let lon= "---";
let lat= "---";

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'The Gym' });
});

/* GET Home */
router.get('/app/home', function (req, res, next) {
  res.render('home', { title: 'The Gym', hr:hr, lon:lon, lat:lat });
});

/* GET Data */
router.get('/data', function (req, res, next) {
  hr= req.query.hr;
  lon= req.query.lon;
  lat= req.query.lat;

  res.end();
  //res.render('home', { title: 'The Gym', hr:hr, lon:lon, lat:lat });
});


module.exports = router;

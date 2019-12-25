let express = require('express');
let router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'The Gym' });
});

/* GET Home */
router.get('/app/home', function (req, res, next) {
  res.render('home', { title: 'The Gym', hr:global.hr, lon:global.lon, lat:global.lat });
});

module.exports = router;

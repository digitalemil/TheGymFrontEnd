let express = require('express');
let router = express.Router();
global.hr= "---";
global.lon= "---";
global.lat= "---";
global.user= "---";
var passwd= require('../passwd.json');


/* Data 

router.all("hr"), function (req, res, next) {
  if(passwd.password!= req.query.password) {
      res.write("Unauthorized");
      res.end();
      return;
  }
  let obj= new Object();
    obj.hr= global.hr;
    obj.lon= global.lon;
    obj.lat= global.lat;
    obj.user= global.user;
  res.write(JSON.stringify(obj))
}
*/

router.all('/', function (req, res, next) {
    if(passwd.password!= req.query.password) {
        res.write("User "+req.user+" unauthorized.");
        res.end();
        return;
    }
    global.hr= req.query.hr;
    global.lon= req.query.lon;
    global.lat= req.query.lat;
    global.user= req.query.user;

    //console.log(req.query)
    let obj= new Object();
    obj.hr= global.hr;
    obj.lon= global.lon;
    obj.lat= global.lat;
    obj.user= req.query.user;

    io.emit("session", obj);

    res.write("Thank you.\n");
    res.end();
  //res.render('home', { title: 'The Gym', hr:hr, lon:lon, lat:lat });
});
 

module.exports = router;

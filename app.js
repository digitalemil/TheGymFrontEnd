
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const basicAuth = require('express-basic-auth');
let darkmode= true;


var app = express();




let config= JSON.parse(process.env.CONFIG);
//let config= require('./config.json');
var passwd= require('./passwd.json');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

function extractProfile(profile) {
  console.log("User authenticated: "+profile.id+" "+profile.displayName);
  let imageUrl = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl,
    email: profile.emails[0]
  };
  
}

passport.use(
  new GoogleStrategy(
    {
      clientID: config.OAUTH2_CLIENT_ID,
      clientSecret: config.OAUTH2_CLIENT_SECRET,
      callbackURL: config.OAUTH2_CALLBACK,
      accessType: 'offline',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    (accessToken, refreshToken, profile, cb) => {
      cb(null, extractProfile(profile));
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});



const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: config.OAUTH2_CLIENT_SECRET,
  signed: true
};

app.use(requireHTTPS);
app.use(session(sessionConfig));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware that requires the user to be logged in. If the user is not logged
// in, it will redirect the user to authorize the application and then return
// them to the original URL they requested.
function authRequired(req, res, next) {
  if (!req.user) {
    req.session.oauth2return = req.originalUrl;
    return res.redirect('/auth/login');
  }
  next();
}

// Middleware that exposes the user's profile as well as login/logout URLs to
// any templates. These are available as `profile`, `login`, and `logout`.
function addTemplateVariables(req, res, next) {
  res.locals.profile = req.user;
  res.locals.login = `/auth/login?return=${encodeURIComponent(
    req.originalUrl
  )}`;
  res.locals.logout = `/auth/logout?return=${encodeURIComponent(
    req.originalUrl
  )}`;
  next();
}

var indexRouter = require('./routes/index');
var dataRouter = require('./routes/data');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use('/app', authRequired);
app.use('/app/*', authRequired);
app.use('/', indexRouter);
app.use('/hr', indexRouter);


// ToDo: Add Grafana Metrics
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });
app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());  
  } catch (err) {
    res.status(500).end(err);
  }
});



let obj= new Object();
obj[passwd.user]= passwd.password;
/*
app.use(basicAuth({
  users: obj
}))*/
app.use('/data', dataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

indexRouter.get(
  // Login url
  '/auth/login',

  // Save the url of the user's current page so the app can redirect back to
  // it after authorization
  (req, res, next) => {
    if (req.query.return) {
      req.session.oauth2return = req.query.return;
    }
    next();
  },

  // Start OAuth 2 flow using Passport.js
  passport.authenticate('google', {scope: ['email', 'profile']})
);

indexRouter.get(
  '/logout',(req, res, next) => {
    req.logOut();
    console.log("User logged out.");
    res.redirect("/");
});

indexRouter.get(
  // OAuth 2 callback url. Use this url to configure your OAuth client in the
  // Google Developers console
  '/auth/google/callback',

  // Finish OAuth 2 flow using Passport.js
  passport.authenticate('google'),

  
  // Redirect back to the original page, if any
  (req, res) => {
    let redirect = req.session.oauth2return || '/';
    if(!"digitalemil@googlemail.com"==req.session.passport.user.email.value) {
      redirect= "/nouser";
      console.log("User: "+JSON.stringify(req.session.passport.displayName)+" not allowed");
      delete req.session.passport;
    }
    delete req.session.oauth2return;
  
    res.redirect(redirect);
  }
);

/*
setTimeout(load, 5000);

const axios = require('axios').default;
function load() {
  let hr= Math.round(174 -Math.random()*48);
  axios.get('http://localhost:3000/data?user=data&password=adjhaADbdhY7nkjdasd7y72GUG7cFv6&lon=-0.118092&lat=51.509865&hr='+hr)
  setTimeout(load, 1000);
}
*/


module.exports = app;

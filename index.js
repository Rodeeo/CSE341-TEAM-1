const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const csrf = require('csurf');
const flash = require('connect-flash');
const cors = require('cors');
const User = require('./models/user');

const corsOptions = {
    origin: "https://https://tiempo-team1.herokuapp.com/",
    optionsSuccessStatus: 200
 };

const errorController = require('./controllers/error');

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://webadmin:kjfF2foda16U4hAm@cluster0.vhpz6.mongodb.net/tiempo?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});
const csrfProtection = csrf();
app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.set('views', 'views');

const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.user = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});
app.use('/', routes);
//app.get('/500', errorController.get500);
app.use(errorController.get404);
/*
app.use((error, req, res, next) => {
  res.status(500).render('pages/500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});*/
mongoose
  .connect(MONGODB_URL,{ useNewUrlParser: true,useUnifiedTopology: true})
  .then(result => {
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });

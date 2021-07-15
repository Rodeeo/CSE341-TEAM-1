const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const cors = require('cors');
const User = require('./models/user');
const { config } = require('./config');


const corsOptions = {
    origin: "https://https://tiempo-team1.herokuapp.com/",
    optionsSuccessStatus: 200
 };

const errorController = require('./controllers/error');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = encodeURIComponent(config.dbName);
const PORT = encodeURIComponent(config.port);


const MONGODB_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
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
  .connect(MONGODB_URI,{ useNewUrlParser: true,useUnifiedTopology: true})
  .then(result => {
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
      console.log(`http://127.0.0.1:${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });

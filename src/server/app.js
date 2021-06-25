const path = require("path");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
// const mongoConnect = require("./util/database").mongoConnect;
const MongoDBStore = require("connect-mongodb-session")(session);
const { config } = require('../../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

// V This crashes the app for now V
/* const corsOptions = {
  origin: "https://tiempo-team1.herokuapp.com/",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions)); */

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4,
};

const MONGODB_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const app = express();
app.set("view engine", "ejs");
app.set("views", process.cwd() + '/src/frontend/views');

const timecardRoutes = require("../frontend/routes/timecard");
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(timecardRoutes);
app.use(authRoutes);
mongoose
  // Passing options to avoid using deprecated parser
  .connect(MONGODB_URI, options)
  .then((result) => {
    app.listen(config.port, () => {
      console.log(`Listening on ${config.port}`);
      console.log(`http://127.0.0.1:${config.port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

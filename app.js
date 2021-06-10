const path = require("path");

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoConnect = require("./util/database").mongoConnect;
const MongoDBStore = require("connect-mongodb-session")(session);

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

const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000
const MONGODB_URL = "mongodb+srv://Bob:Bob123@tiempo-team1.hrin5.mongodb.net/Tiempo-Team1";

const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const timecardRoutes = require("./routes/timecard");
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
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
  .connect(MONGODB_URL, options)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
      console.log(`http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

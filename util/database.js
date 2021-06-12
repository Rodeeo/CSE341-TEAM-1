const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4,
};

const MONGODB_URL =
  process.env.MONGODB_URL ||
  "mongodb+srv://Bob:Bob123@tiempo-team1.hrin5.mongodb.net/Tiempo-Team1?retryWrites=true&w=majority";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URL, options)
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

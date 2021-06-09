const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

//const { Server } = require('http');
//const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const timecardRoutes = require('./routes/timecard');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(timecardRoutes);


//.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.listen(5000);
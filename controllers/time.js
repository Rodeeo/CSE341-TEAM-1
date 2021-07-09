const Time = require('../models/time');
const { validationResult } = require('express-validator/check');
exports.getCard = (req, res, next) => {
  res.render('time/card', {
    path: '/card',
    pageTitle: 'New Time Card',
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });

};
exports.postCard = (req, res, next) => {
  const activity = req.body.activity;
  const date = req.body.date;
  const duration = req.body.duration;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('time/card', {
      pageTitle: 'New Time Card',
      path: '/card',
      editing: false,
      hasError: true,
      time: {
        activity: activity,
        date: date,
        duration: duration
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  const time = new Time({
    activity: activity,
    date: date,
    duration: duration,
    userId: req.user
  });
  console.log(time);
  time
    .save()
    .then(result => {
      // console.log(result);
      console.log('Card Added');
      res.redirect('/');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
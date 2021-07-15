const Time = require('../models/time');

const ITEMS_PER_PAGE = 10;
const {
  validationResult
} = require('express-validator/check');
exports.aboutTime = (req, res, next) => {
  res.render('time/about', {
    pageTitle: 'About',
    path: '/about',
  });
};
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
exports.getTotal = (req, res, next) => {
  const page = +req.query.page || 1;
  let date1 = req.query.startDate;
  let date2 = req.query.endDate;
  let totalItems = 0
  let totalHours = 0;
  let data = [];

  Time.find({
    userId: req.user._id
  }).
  then(times => {
    // TODO: this solution is pretty crude
    if (date1 == undefined || date2 == undefined) {
      let year = new Date().getFullYear();
      date1 = year + '-01-01';
      date2 = year + '-12-31';
    }
    d1 = new Date(date1);
    d2 = new Date(date2);
    times = times.filter(e => {
      let st = new Date(e.date);
      if (st >= d1 && st <= d2) {
        return true;
      } else {
        return false;
      }
    });
    times.forEach(a => {
      totalHours = totalHours + (+a.duration);
    });
    totalItems = times.length;
    data = times.slice((page - 1) * ITEMS_PER_PAGE, ((page - 1) * ITEMS_PER_PAGE) + ITEMS_PER_PAGE);
    res.render('time/total', {
      pageTitle: 'Total Time',
      path: '/total',
      data: data,
      date1: d1,
      date2: d2,
      totalHours: totalHours,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  })
};
exports.getTotalByEmployee = (req, res, next) => {
  const page = +req.query.page || 1;
  let date1 = req.query.startDate;
  let date2 = req.query.endDate;
  let totalItems = 0
  let data = [];
  Time.find().populate('userId').exec((err, times) => {
    // TODO: this solution is pretty crude
    if (date1 == undefined || date2 == undefined) {
      let year = new Date().getFullYear();
      date1 = year + '-01-01';
      date2 = year + '-12-31';
    }
    d1 = new Date(date1);
    d2 = new Date(date2);
    times = times.filter(e => {
      let st = new Date(e.date);
      if (st >= d1 && st <= d2) {
        return true;
      } else {
        return false;
      }
    });
    let result = [];
    times.reduce((res, value) => {
      if (!res[value.userId.name]) {
        res[value.userId.name] = {
          name: value.userId.name,
          duration: 0
        };
        result.push(res[value.userId.name]);
      }
      res[value.userId.name].duration += value.duration;
      return res;
    }, {});
    times = result;
    totalItems = times.length;
    data = times.slice((page - 1) * ITEMS_PER_PAGE, ((page - 1) * ITEMS_PER_PAGE) + ITEMS_PER_PAGE);
    res.render('time/totalusers', {
      pageTitle: 'Total Time',
      path: '/total',
      data: data,
      date1: d1,
      date2: d2,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  })
};
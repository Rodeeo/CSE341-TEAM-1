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
  const date1 = req.query.startDate;
  const date2 = req.query.endDate;
  let totalItems = 0
  let totalHours = 0;
  let data = [];
  if (date1 != undefined && date2 != undefined) {
    Time.find({
      userId: req.user._id
    }).
    then(times => {
      times = times.filter(e => {
        let d1 = new Date(date1);
        let d2 = new Date(date2);
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
        date1: date1,
        date2: date2,
        totalHours: totalHours,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
  } else {
    // TODO: fix pagination (unsure why it breaks after changing pages)
    // TODO: fix or at least simplify non-searched results
    // This solution is both redundant and crude
    Time.find({
      userId: req.user._id
    }).
    then(times => {
      times = times.filter(e => {
        let d1 = new Date('January 1, 2000 00:00:00');
        let d2 = new Date('January 1, 2100 00:00:00');
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
        date1: date1,
        date2: date2,
        totalHours: totalHours,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
  }
};
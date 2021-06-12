const ITEMS_PER_PAGE = 10;
exports.getTime = (req, res, next) => {
  res.render('index', {
    pageTitle: 'Home',
    path: '/',
  });
};
exports.enterTime = (req, res, next) => {
  res.render('time/entertime', {
    pageTitle: 'Enter Time',
    path: '/entertime',
  });
};
exports.totalTime = (req, res, next) => {
  const page = +req.query.page || 1;
  var dataJson = require('../models/data.json');
  let totalItems = dataJson.length;
  let data=dataJson.slice((page-1)*ITEMS_PER_PAGE,((page-1)*ITEMS_PER_PAGE)+ITEMS_PER_PAGE);
  res.render('time/totaltime', {
    pageTitle: 'Total Time',
    path: '/totaltime',
    data: data,
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
  });
};

exports.aboutTime = (req, res, next) => {
  res.render('time/about', {
    pageTitle: 'About',
    path: '/about',
  });
};
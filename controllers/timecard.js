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
  const date1 = req.query.startDate;
  const date2 = req.query.endDate;
  let totalHours=0;
  console.log(date1);
  console.log(date2);
  if(date1!=undefined && date2!=undefined){
    dataJson = dataJson.filter(e=>
      {
        let d1=new Date(date1);
        let d2=new Date(date2);
        let st=new Date(e.startDate);
        if(st>=d1 && st<=d2){
          return true;
        }else{
          return false;
        }
      });
    dataJson.forEach(a=>{
      let h = a.duration.split(":");
      totalHours=totalHours+(+h[0]);
    })
  }
  let totalItems = dataJson.length;
  let data=dataJson.slice((page-1)*ITEMS_PER_PAGE,((page-1)*ITEMS_PER_PAGE)+ITEMS_PER_PAGE);
  res.render('time/totaltime', {
    pageTitle: 'Total Time',
    path: '/totaltime',
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
};
// exports.totalHours = (req, res, next) => {
//   const date1 = req.params.date1;
//   const date2 = req.params.date2;
//   var dataJson = require('../models/data.json');
//   dataJson=dataJson.filter(a=>{a.startDate>=date1 && a.startDate>=date2});
//   let totalItems = dataJson.length;
//   let data=dataJson.slice((page-1)*ITEMS_PER_PAGE,((page-1)*ITEMS_PER_PAGE)+ITEMS_PER_PAGE);
//   res.render('time/totaltime', {
//     pageTitle: 'Total Time',
//     path: '/totaltime',
//     data: data,
//     currentPage: page,
//     hasNextPage: ITEMS_PER_PAGE * page < totalItems,
//     hasPreviousPage: page > 1,
//     nextPage: page + 1,
//     previousPage: page - 1,
//     lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
//   });
// };

exports.aboutTime = (req, res, next) => {
  res.render('time/about', {
    pageTitle: 'About',
    path: '/about',
  });
};
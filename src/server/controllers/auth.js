const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup'
    });
  };
exports.login = (req, res, next) => {
    const email = req.body.email;
  const password = req.body.password;
//   console.log(email);

  let loadedUser;
  User.findOne({ userEmail: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.userPassword);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.userEmail,
          userId: loadedUser._id.toString()
        },
        'supersecretsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

};

exports.signup = (req, res, next) => {
//     const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed.');
//     error.statusCode = 422;
//     error.data = errors.array();
//     throw error;
//   }
  const email = req.body.email;
  const name = req.body.name;
  const lastName = req.body.lastName;
  const password = req.body.password;
  console.log(email, name, lastName, password)
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        userEmail: email,
        userPassword: hashedPw,
        userName: name,
        userLastName: lastName
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User created!', userId: result._id });
      res.redirect('/');
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// exports.postLogin = (req, res, next) => {

// };

// exports.postSignup = (req, res, next) => {

// };

// exports.postLogout = (req, res, next) => {
//     res.redirect('/');
// };

// exports.getReset = (req, res, next) => {

// };

// exports.postReset = (req, res, next) => {

// };

// exports.getNewPassword = (req, res, next) => {

// };

// exports.postNewPassword = (req, res, next) => {
//     res.redirect('/login');
// };
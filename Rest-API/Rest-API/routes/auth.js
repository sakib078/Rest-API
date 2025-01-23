
const authController = require('../controller/auth.js');
const { body, check, customise } = require('express-validator');

const express = require('express');

const router = express.Router();


router.put('/signup',
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().not().isEmpty(),

    body('email').custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email address already exists');
            }
        })
    }),
    body('username').custom((value, { req }) => {
        return User.findOne({ username: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Username already exists');
            }
        })
    })
    , authController.signup);

router.post('/login',
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').trim().isLength({ min: 5 })
    , authController.login);


module.exports = router;
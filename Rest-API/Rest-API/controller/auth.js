

const User = require('../models/user.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');


exports.signup = (req, res, next) => {

    const errors = validationResult(req);  //validation error

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    console.log('signup middleware')

    const email = req.body.email;
    const username = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12).then(haspass => {
        const newuser = new User({
            username: username,
            email: email,
            password: haspass,
        })

        return newuser.save()

    }).then(result => {
        res.status(201).json({
            message: 'New user created',
            userId: result._id
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })


}


exports.login = (req, res, next) => {

    console.log('login middleware')

    const errors = validationResult(req);  //validation error

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;


    User.findOne({ email: email }).then(user => {
        if (user) {
            console.log('user found');
            bcrypt
                .compare(password, user.password).then(isEquel => {

                    if (!isEquel) {
                        const error = new Error('Validation failed, entered data is incorrect');
                        error.statusCode = 422;
                        throw error;
                    }

                    const jsonwebtoken = jwt.sign({
                        email: user.email, userId: user._id.toString()
                    }, 'samaybahuimportantchhe', { expiresIn: '1h' });


                    console.log('user logged in');
                    res.status(200).json({ message: 'User logged in', userId: user._id.toString(), token: jsonwebtoken });


                }).catch(err => {
                    console.log(err);
                })
        }
    }
    ).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}
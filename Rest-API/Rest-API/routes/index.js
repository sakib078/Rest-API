

const express = require('express');

const router = express.Router();
const { body } = require('express-validator');

const isAuth = require('../../middlewares/is-auth.js');

const feedController = require('../controller/index.js');

// GET /posts
router.get('/posts', isAuth, feedController.getPosts);

// POST /post
router.post('/post', isAuth,
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 })
    ]
    , feedController.createPost);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth,
    [
        body('title').trim().isLength({ min: 0 }),
        body('content').trim().isLength({ min: 0 })
    ]
    , feedController.editPost);


router.delete('/post/:postId', isAuth, feedController.deletePost);



module.exports = router;
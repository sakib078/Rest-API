
const { validationResult } = require('express-validator');
const Post = require('../models/post.js');
const User = require('../models/user.js');
const fs = require('fs');
const path = require('path');
const user = require('../models/user.js');
const io = require('../socket.js');

exports.getPosts = (req, res) => {

    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;

    Post.find().countDocuments().then(count => {
        totalItems = count;
        return Post.find().populate('creator').sort({ createdAt: -1 }).skip((currentPage - 1) * perPage).limit(perPage);
    }).then(posts => {
        res.status(200).json({
            message: 'post fetched succesfully',
            posts: posts,
            totalItems: totalItems
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.createPost = (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image provided ');
        error.statusCode = 422;
        throw error;

    }

    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId,
        createdAt: new Date()
    });
    console.log(post);

    // Create post in db

    post.save()
        .then(result => {
            return User.findById(req.userId);
        }).then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        }).then(result => {
            io.getIO().emit('posts', { action: 'create', post: { ...post._doc, creator: { _id: req.userId, name: user.username } } });
            res.status(201).json({
                message: 'Post created successfully!',
                post: post,
                creator: { _id: creator._id, name: user.username }
            });

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getPost = (req, res) => {

    const postId = req.params.postId;

    Post.findById(postId).then(post => {
        if (!post) {
            const error = new Error('could not find the product');
            error.statusCode = 422;
            throw error;
        }
        res.status(200).json({ post: post });

    }
    ).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log(err);
    })

}

exports.editPost = (req, res) => {

    console.log('Edit post');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const postId = req.params.postId;

    const updatedtitle = req.body.title;
    let updatedimageUrl = req.body.imageUrl;
    const updatedcontent = req.body.content;

    if (req.file) {
        updatedimageUrl = req.file.path;

    }

    if (!updatedimageUrl) {
        const error = new Error('No file is picked!');
        error.statusCode = 422;
        throw error;
    }


    Post.findById(postId).then(post => {
        if (!post) {
            const error = new Error('could not find the product');
            error.statusCode = 422;
            throw error;
        }

        if (post.creator._id.toString() !== req.userId) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }

        if (updatedimageUrl != post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = updatedtitle;
        post.content = updatedcontent;
        post.imageUrl = updatedimageUrl;

        console.log('The post has been updated succesfully');

        return post.save();
    }
    ).then(result => {
        io.getIO().emit('posts', { action: 'update', post: result });
        res.status(200).json({ message: 'post updated', post: result });

    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

const clearImage = filepath => {
    filepath = path.join(__dirname, '..', filepath);
    fs.unlink(filepath, err => console.log(err));
}

exports.deletePost = (req, res) => {

    console.log('delete post');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const error = new Error('Validation failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const postId = req.params.postId;

    Post.findById(postId).then(post => {
        if (!post) {
            const error = new Error('could not find the product');
            error.statusCode = 422;
            throw error;
        }

        if (post.creator._id.toString() !== req.userId) {
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }

        clearImage(post.imageUrl);
        return Post.findByIdAndDelete(postId);


    })
        .then(result => {
            return User.findById(req.userId)
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted post', post: result });
            io.getIO().emit('posts', { action: 'delete', post: postId });
            console.log('Post deleted');
        }).catch(err => {

            if (!err.statusCode) {
                err.statusCode = 500;
            }
            console.log(err);
        })
}
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Load Post model
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// New Post Page
router.get('/new', ensureAuthenticated, (req, res) => res.render('new_post'));

// Create Post
router.post('/new', ensureAuthenticated, (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({
    title,
    content,
    author: req.user._id
  });

  newPost.save()
    .then(post => {
      res.redirect('/dashboard');
    })
    .catch(err => console.log(err));
});

// Show Post
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .populate('author')
    .populate({
      path: 'comments',
      populate: { path: 'author' }
    })
    .then(post => {
      res.render('show_post', { post });
    })
    .catch(err => console.log(err));
});

// Create Comment
router.post('/:id/comments', ensureAuthenticated, (req, res) => {
  const newComment = new Comment({
    content: req.body.content,
    author: req.user._id,
    post: req.params.id
  });

  newComment.save()
    .then(comment => {
      Post.findById(req.params.id)
        .then(post => {
          post.comments.push(comment._id);
          post.save()
            .then(() => res.redirect(`/posts/${req.params.id}`));
        });
    })
    .catch(err => console.log(err));
});

module.exports = router;

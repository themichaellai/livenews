var router = require('express').Router();
var Thread = require('../models/thread');
var Post = require('../models/post');
var _ = require('underscore');

module.exports = function(io, mongoose) {
  router.get('/', function(req, res) {
    var threads = Thread.find({}, function(err, threads) {
      return res.render('admin/index', {
        title: 'Admin Interface',
        threads: threads
      });
    });
  });

  router.get('/threads/:id', function(req, res) {
    var thread = Thread.findOne({id: req.param.id}, function(err, thread) {
      if (err) return res.redirect('/admin');
      return res.render('admin/threads/show', {
        title: thread.name,
        thread: thread
      });
    });
  });

  router.post('/threads/:id/post', function(req, res) {
    var postAttrs = {
      threadId: req.params.id,
      type: "text",
      text: req.body.text,
      title: req.body.title
    };
    if ('image' in req.files) {
      postAttrs = _.extend(postAttrs, {
        imageFilename: req.files.image.name,
      });
    }
    var post = new Post(postAttrs);
    io.emit('new-post', {
      post: post
    });
    post.save();
    return res.redirect('/admin/threads/' + req.params.id);
  });

  router.post('/threads', function(req, res) {
    var thread = new Thread({
      name: req.body.threadName,
      description: req.body.description
    });
    thread.save(function(err) {
      if (err) console.log(err);
    });
    return res.redirect('/admin');
  });

  return router;
};


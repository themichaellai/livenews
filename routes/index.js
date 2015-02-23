var express = require('express');
var router = express.Router();
var Thread = require('../models/thread');
var Post = require('../models/post');
var async = require('async');

module.exports = function(io, mongoose) {
  router.get('/', function(req, res) {
    var threads = Thread.find({}, function(err, threads) {
      return res.render('index', {
        title: 'ChronLive',
        threads: threads
      });
    })
  });

  router.get('/threads/:id', function(req, res) {
    async.parallel([
        function(cb) {
          Thread.findOne({_id: req.params.id}, function(err, thread) {
            if (err) return cb(err);
            cb(null, thread);
          });
        },
        function(cb) {
          Post.find({threadId: req.params.id}, function(err, posts) {
            if (err) return cb(err);
            cb(null, posts);
          });
        }
      ],
      function(err, results) {
        return res.render('threads/show', {
          title: results[0].name,
          thread: results[0],
          posts: results[1]
        });
      }
    )
  });

  router.get('/admin', function(req, res) {
    var threads = Thread.find({}, function(err, threads) {
      return res.render('admin/index', {
        title: 'Admin Interface',
        threads: threads
      });
    })
  });

  router.get('/admin/threads/:id', function(req, res) {
    var thread = Thread.findOne({id: req.param.id}, function(err, thread) {
      if (err) return res.redirect('/admin');
      return res.render('admin/threads/show', {thread: thread});
    });
  });

  router.post('/admin/threads/:id/post', function(req, res) {
    var post = new Post({
      threadId: req.params.id,
      type: "text",
      text: req.body.messageText
    });
    io.emit('new-post', {
      post: post
    });
    post.save();
    return res.redirect('/admin/threads/' + req.params.id);
  });

  router.post('/admin/threads', function(req, res) {
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

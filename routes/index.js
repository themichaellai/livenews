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

  return router;
};

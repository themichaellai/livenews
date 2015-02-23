var express = require('express');
var router = express.Router();

module.exports = function(io) {
  router.get('/', function(req, res) {
    return res.render('index', { title: 'ChronLive' });
  });

  router.get('/admin', function(req, res) {
    return res.render('admin', {title: 'Admin Interface'});
  });

  router.post('/admin/post', function(req, res) {
    io.emit('message', {
      message: req.body.messageText
    });
    return res.redirect('/admin');
  });
  return router;
};

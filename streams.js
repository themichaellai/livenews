var Socket = function(http) {
  var io = require('socket.io')(http);
  io.on('connection', function(socket) {
    socket.emit('connect-success', {msg: 'hello world'});
  });
}

module.exports = Socket

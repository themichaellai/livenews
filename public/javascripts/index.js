var socket = io.connect('http://localhost:3000');
socket.on('connect-success', function (data) {
  console.log(data.msg);
});

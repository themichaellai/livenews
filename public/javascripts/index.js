var host = location.hostname+(location.port ? ':'+location.port: '');
var socket = io.connect(host);
socket.on('connect-success', function(data) {
  console.log(data.msg);
});

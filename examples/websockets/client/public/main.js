const socket = io();

$('#form').submit(() => {
  socket.emit('chat message',$('#msg').val());
  $('#msg').val('');
  return false;
});

socket.on('chat message', (msg) => {
  $('#message').append($('<li>').text(msg));
});

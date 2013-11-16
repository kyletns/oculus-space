// Generated by CoffeeScript 1.6.3
(function() {
  var App, socket;

  App = {
    room: null,
    data: {}
  };

  socket = io.connect('/');

  socket.on("disconnect", function(data) {
    $('#disconnected').fadeIn(500);
    return setTimeout("location.href = location.href", 4500);
  });

  socket.on("init: connected to room", function(data) {
    console.log("Connected to room: " + data.room);
    return App.room = data.room;
  });

  $("#initialize").submit(function() {
    $("#initialize button").attr('disabled', 'disabled').text("Connecting...");
    $("#initialize input").blur();
    socket.emit('init: add controller', {
      room: $("#initialize input").val()
    });
    return false;
  });

}).call(this);
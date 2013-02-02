// Generated by CoffeeScript 1.4.0
(function() {
  var App,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App = {};

  App.metagames = [];

  App.players = [];

  App.Metagame = (function() {

    function Metagame() {
      this.drawPlayerList = __bind(this.drawPlayerList, this);

      this.addPlayer = __bind(this.addPlayer, this);
      this.id = Math.random().toString(36).substring(2, 6);
    }

    Metagame.prototype.url = function() {
      return "/" + this.id;
    };

    Metagame.prototype.isAcceptingPlayers = function() {
      return true;
    };

    Metagame.prototype.serverInit = function(io) {
      var _this = this;
      this.players = [];
      this.room = io.of("/" + this.id);
      return this.room.on('connection', function(socket) {
        return socket.on('player joining', _this.addPlayer);
      });
    };

    Metagame.prototype.addPlayer = function(data) {
      this.players.push(data.player);
      return this.room.emit('player list updated', this.players);
    };

    Metagame.prototype.clientInit = function(io) {
      var _this = this;
      this.el = $("<div>").addClass('active view').attr("id", "metagame").text("test");
      $('.active.view').removeClass('active');
      $('body').append(this.el);
      this.socket = io.connect("/" + this.id);
      this.socket.emit('player joining', {
        player: App.player
      });
      return this.socket.on('player list updated', function(players) {
        _this.players = players;
        return _this.drawPlayerList();
      });
    };

    Metagame.prototype.drawPlayerList = function() {
      console.log(this.players);
      return this.el.html(JSON.stringify(this.players));
    };

    return Metagame;

  })();

  App.Player = (function() {

    function Player(name) {
      this.name = name;
      this.id = Math.random().toString(36).substring(2, 6);
    }

    return Player;

  })();

  App.Minigame = (function() {

    function Minigame() {}

    return Minigame;

  })();

  App.Utilities = {
    checkOrientation: function() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) && $(window).width() > $(window).height()) {
        return alert('To play Mobile Party, you should use portrait orientation on your phone. (You may want to lock your phone in this orientation!)');
      }
    }
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = App;
  } else {
    window.App = App;
  }

}).call(this);

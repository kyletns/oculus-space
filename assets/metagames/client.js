// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App.Metagame = (function() {

    Metagame.TEMPLATES = "/assets/metagames/default/templates/templates.js";

    Metagame.STYLESHEET = "/assets/metagames/default/css/metagame.css";

    function Metagame(id) {
      this.id = id;
      this.receiveBroadcast = __bind(this.receiveBroadcast, this);

      this.playerReady = __bind(this.playerReady, this);

      this.addMinigame = __bind(this.addMinigame, this);

      this.minigameShowInstructions = __bind(this.minigameShowInstructions, this);

      this.minigameLoad = __bind(this.minigameLoad, this);

      this.minigameCountdown = __bind(this.minigameCountdown, this);

      this.showResults = __bind(this.showResults, this);

      this.showScoreboard = __bind(this.showScoreboard, this);

      this.updateScoreboard = __bind(this.updateScoreboard, this);

      this.updateInstructions = __bind(this.updateInstructions, this);

      this.metagameStart = __bind(this.metagameStart, this);

      this.updateWaitingRoom = __bind(this.updateWaitingRoom, this);

      this.init = __bind(this.init, this);

      this.getPlayer = __bind(this.getPlayer, this);

    }

    Metagame.prototype.getPlayer = function(id) {
      var player, _i, _len, _ref;
      _ref = this.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.id === id) {
          return player;
        }
      }
      return null;
    };

    Metagame.prototype.minigames = [];

    Metagame.prototype.init = function(io, name) {
      var _this = this;
      $('head').append("<link rel='stylesheet' href='" + this.constructor.STYLESHEET + "'>");
      return $.getScript(this.constructor.TEMPLATES).done(function(script, textStatus) {
        console.log("New metagame with id " + _this.id);
        _this.el = $("<div>").addClass('active view').attr("id", "metagame").hide();
        _this.el.html(_.template(App.Metagame.Default.Templates.main_view));
        $('body').append(_this.el);
        $('.active.view').removeClass('active').fadeOut();
        _this.el.fadeIn();
        _this.socket = io.connect("/" + _this.id);
        _this.socket.emit('players: player joining', {
          name: name
        });
        _this.socket.on('players: list updated', function(players) {
          _this.players = players;
          _this.updateWaitingRoom();
          _this.updateInstructions();
          _this.updateScoreboard();
          if (_this.currentMinigame != null) {
            return _this.currentMinigame.playersUpdated();
          }
        });
        _this.socket.on('metagame: start', _this.metagameStart);
        _this.socket.on('minigame: load', _this.minigameLoad);
        _this.socket.on('minigame: start', function() {
          return _this.minigameCountdown();
        });
        _this.socket.on('minigame: gameover', function() {
          return _this.showResults();
        });
        return _this.socket.on('broadcast', _this.receiveBroadcast);
      });
    };

    Metagame.prototype.updateWaitingRoom = function() {
      var _this = this;
      this.el.find('#waiting_room').html(_.template(App.Metagame.Default.Templates.waiting_room, {
        players: this.players
      }));
      return this.el.find('#waiting_room button').click(function() {
        if (_this.players.length < 1) {
          return alert("You need at least two people to play!");
        } else {
          return _this.socket.emit('metagame: start');
        }
      });
    };

    Metagame.prototype.metagameStart = function() {
      this.el.find('#intro').html(_.template(App.Metagame.Default.Templates.intro, {
        players: this.players
      }));
      return this.el.find('#waiting_room').slideUp(500);
    };

    Metagame.prototype.updateInstructions = function() {
      var _this = this;
      if (this.currentMinigame) {
        this.el.find('#pregame').html(_.template(App.Metagame.Default.Templates.pregame, {
          name: this.currentMinigame.constructor.NAME,
          instructions: this.currentMinigame.constructor.INSTRUCTIONS,
          players: this.players
        }));
        return this.el.find('#pregame button').click(function() {
          return _this.playerReady();
        });
      }
    };

    Metagame.prototype.updateScoreboard = function() {
      return this.el.find('#scoreboard').html(_.template(App.Metagame.Default.Templates.scoreboard, {
        players: this.players
      }));
    };

    Metagame.prototype.showScoreboard = function() {
      this.updateScoreboard();
      return this.el.find('#scoreboard').show();
    };

    Metagame.prototype.showResults = function() {
      this.updateScoreboard();
      this.el.find('#scoreboard').show();
      return setTimeout(this.el.find('#pregame').slideDown, 5000);
    };

    Metagame.prototype.minigameCountdown = function() {
      var _this = this;
      console.log("Starting " + this.currentMinigame.constructor.NAME + " in 2 seconds!");
      this.el.find('#countdown').html(_.template(App.Metagame.Default.Templates.countdown), {}).show();
      $('#backgrounds').fadeOut(3000);
      $('#overlay').fadeIn(3000);
      setTimeout((function() {
        return _this.el.find('#countdown span').text("2");
      }), 1000);
      setTimeout((function() {
        return _this.el.find('#countdown span').text("1");
      }), 2000);
      setTimeout((function() {
        return _this.el.fadeOut(500);
      }), 2500);
      setTimeout((function() {
        _this.el.find('#countdown').hide();
        return _this.el.find('#pregame').hide();
      }), 3000);
      return setTimeout(this.currentMinigame.start, 3000);
    };

    Metagame.prototype.minigameLoad = function(data) {
      var _this = this;
      this.el.find(".next_game").text(data.minigame.name);
      this.el.find(".next_game").fadeIn(300);
      setTimeout((function() {
        return _this.el.find('#intro').slideUp(500);
      }), 2000);
      console.log("LOADING MINIGAME: " + data.minigame.name);
      this.el.find('#instructions').show();
      if (this.minigames[data.minigame.name]) {
        this.currentMinigame = new this.minigames[data.minigame.name];
        this.currentMinigame.init();
        return this.minigameShowInstructions();
      } else {
        return $.getScript(data.minigame.src).done(function(script, textStatus) {
          _this.currentMinigame = new _this.minigames[data.minigame.name];
          _this.currentMinigame.init();
          return _this.minigameShowInstructions();
        });
      }
    };

    Metagame.prototype.minigameShowInstructions = function() {
      return this.updateInstructions();
    };

    Metagame.prototype.addMinigame = function(minigame) {
      return this.minigames[minigame.NAME] = minigame;
    };

    Metagame.prototype.playerReady = function() {
      this.ready = true;
      return this.socket.emit('metagame: player ready');
    };

    Metagame.prototype.gameover = function(minigame) {
      $('#backgrounds').fadeIn(1000);
      $('#overlay').fadeOut(1000);
      this.socket.emit('minigame: gameover', {
        score: minigame.score
      });
      return this.el.fadeIn();
    };

    Metagame.prototype.sendBroadcast = function(event, data) {
      return this.socket.emit('broadcast', {
        _event: event,
        _data: data
      });
    };

    Metagame.prototype.receiveBroadcast = function(data) {
      if (this.currentMinigame != null) {
        return this.currentMinigame.receiveBroadcast(data._event, data._data, data._player_id);
      }
    };

    return Metagame;

  })();

}).call(this);

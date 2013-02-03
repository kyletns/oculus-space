// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Minigames.DoubleTapRace = (function(_super) {

    __extends(DoubleTapRace, _super);

    function DoubleTapRace() {
      this.receiveBroadcast = __bind(this.receiveBroadcast, this);

      this.gameover = __bind(this.gameover, this);

      this.render = __bind(this.render, this);

      this.animateFeet = __bind(this.animateFeet, this);

      this.getPlayerRep = __bind(this.getPlayerRep, this);

      this.start = __bind(this.start, this);
      return DoubleTapRace.__super__.constructor.apply(this, arguments);
    }

    DoubleTapRace.NAME = 'DoubleTapRace';

    DoubleTapRace.INSTRUCTIONS = 'DoubleTapRace is a fun game. Click the buttons to move legs.';

    DoubleTapRace.TEMPLATES = "/assets/minigames/double_tap_race/templates/templates.js";

    DoubleTapRace.STYLESHEET = "/assets/minigames/double_tap_race/css/double_tap_race.css";

    DoubleTapRace.prototype.inspirations = ["You can do it!", "Show 'em who's boss!", "Go get 'em, tiger!", "Look at those little legs go!", "Run, Forrest!"];

    DoubleTapRace.prototype.init = function() {
      DoubleTapRace.__super__.init.apply(this, arguments);
      if (!(App.Minigames.DoubleTapRace.Templates != null)) {
        $('head').append("<link rel='stylesheet' href='" + this.constructor.STYLESHEET + "'>");
        return $.getScript(this.constructor.TEMPLATES);
      }
    };

    DoubleTapRace.prototype.start = function() {
      var that;
      this.clickCount = 0;
      this.dist = 0;
      _.each(this.players, function(player) {
        return player.dist = 0;
      });
      this.el = $("<div>").addClass('active view').attr("id", "double-tap-race-minigame");
      this.el.html(_.template(App.Minigames.DoubleTapRace.Templates.main_view));
      this.el.find(".progress").html(_.template(App.Minigames.DoubleTapRace.Templates.player_view, {
        players: this.players
      }));
      $('body').append(this.el);
      this.render();
      that = this;
      this.el.find(".btn").bind('click', function() {
        that.clickCount++;
        if ($(this).hasClass("active")) {
          $(this).siblings(".btn").addClass("active");
          $(this).removeClass("active");
          that.dist += 5;
          that.broadcast('player: scored', {
            dist: that.dist
          });
          return that.render();
        }
      });
      return this.el.find(".btn").bind('touchstart', function(e) {
        e.preventDefault();
        that.clickCount++;
        if ($(this).hasClass("active")) {
          $(this).siblings(".btn").addClass("active");
          $(this).removeClass("active");
          that.dist += 5;
          that.broadcast('player: scored', {
            dist: that.dist
          });
          return that.render();
        }
      });
    };

    DoubleTapRace.prototype.getPlayerRep = function(id) {
      var i, player, _i, _len, _ref;
      _ref = this.players;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        player = _ref[i];
        if (player.id === id) {
          return $('.runner')[i];
        }
      }
      return [];
    };

    DoubleTapRace.prototype.animateFeet = function(rep) {
      var $left, $right;
      $left = $($(rep).find('.left-foot'));
      $right = $($(rep).find('.right-foot'));
      if (parseInt($left.css('left')) === 10) {
        $left.css('left', '30px');
        return $right.css('left', '10px');
      } else {
        $left.css('left', '10px');
        return $right.css('left', '30px');
      }
    };

    DoubleTapRace.prototype.render = function() {
      console.log("click count: " + this.clickCount);
      if (this.clickCount % 15 === 0) {
        return $('.score').text(this.inspirations[Math.floor(this.inspirations.length * Math.random())]);
      }
    };

    DoubleTapRace.prototype.gameover = function() {
      $(this.el).fadeOut();
      $('#double-tap-race-minigame').remove();
      return App.metagame.gameover(this.dist);
    };

    DoubleTapRace.prototype.receiveBroadcast = function(event, data, player_id) {
      var player, _i, _len, _ref, _results;
      if (player_id != null) {
        _ref = this.players;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          player = _ref[_i];
          if (player.id === player_id) {
            player.dist = data.dist;
            $(this.getPlayerRep(player_id)).css('left', player.dist + 20);
            this.animateFeet(this.getPlayerRep(player_id));
            if (player.dist + 50 === 560) {
              this.gameover();
            }
            this.render();
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    return DoubleTapRace;

  })(App.Minigames.Default);

  App.metagame.addMinigame(App.Minigames.DoubleTapRace);

}).call(this);

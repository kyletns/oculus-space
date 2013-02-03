// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Minigames.HideAndSeek = (function(_super) {

    __extends(HideAndSeek, _super);

    function HideAndSeek() {
      this.receiveBroadcast = __bind(this.receiveBroadcast, this);

      this.start = __bind(this.start, this);

      this.init = __bind(this.init, this);
      return HideAndSeek.__super__.constructor.apply(this, arguments);
    }

    HideAndSeek.NAME = 'HideAndSeek';

    HideAndSeek.INSTRUCTIONS = "HideAndSeek is a game about avoiding the intertubes! Avoid the randomly generated memes, and try to get outside! You're either a seeker or a hider in this one.";

    HideAndSeek.TEMPLATES = "/assets/minigames/hide_and_seek/templates.js";

    HideAndSeek.STYLESHEET = "/assets/minigames/hide_and_seek/styles.css";

    HideAndSeek.prototype.init = function() {
      if (!(App.Templates.HideAndSeek != null)) {
        $('head').append("<link rel='stylesheet' href='" + this.constructor.STYLESHEET + "'>");
        $.getScript(this.constructor.TEMPLATES);
      }
      this.grid = [[], [], [], []];
      this.proxyFetch("http://version1.api.memegenerator.net/Instances_Select_ByPopular?languageCode=en&pageIndex=0&pageSize=16&days=7");
      this.forests = ["/assets/minigames/hide_and_seek/images/forest1.jpg", "/assets/minigames/hide_and_seek/images/forest2.jpg", "/assets/minigames/hide_and_seek/images/forest3.jpg"];
      this.taunts = ["more t00bs for you!", "get off that damn computer!", "a sad, sad, habit..."];
      return HideAndSeek.__super__.init.apply(this, arguments);
    };

    HideAndSeek.prototype.start = function() {
      var player, x, y, _i, _j, _k, _len, _ref,
        _this = this;
      for (x = _i = 0; _i <= 3; x = ++_i) {
        for (y = _j = 0; _j <= 3; y = ++_j) {
          this.grid[x][y] = {
            name: "" + x + ", " + y,
            players: []
          };
        }
      }
      this.el = $(_.template(App.Templates.HideAndSeek.main)());
      $("body").append(this.el);
      _ref = this.players;
      for (_k = 0, _len = _ref.length; _k < _len; _k++) {
        player = _ref[_k];
        player.hider = true;
        player.hiddenYet = false;
      }
      this.players.sort(function(a, b) {
        return a.id.localeCompare(b.id);
      });
      this.players[0].seeker = true;
      this.players[0].hider = false;
      this.player = this.getCurrentPlayer();
      if (this.player.seeker) {
        return this.el.html(_.template(App.Templates.HideAndSeek.seekerIntro));
      } else {
        this.el.html(_.template(App.Templates.HideAndSeek.hiderIntro));
        return this.el.find(".confirm").bind("touchstart click", function() {
          return _this.renderGrid();
        });
      }
    };

    HideAndSeek.prototype.notify = function(string) {
      return this.el.find(".notif").html(string);
    };

    HideAndSeek.prototype.randomlyPopulate = function() {
      var i, _i;
      for (i = _i = 0; _i <= 2; i = ++_i) {
        this.players.push({
          location: {
            x: Math.floor(Math.random() * 4),
            y: Math.floor(Math.random() * 4)
          },
          id: Math.floor(Math.random() * 500),
          name: Math.floor(Math.random() * 500),
          hider: true,
          hiddenYet: true,
          color: ["black", "red", "green"][i]
        });
      }
      return this.renderGrid();
    };

    HideAndSeek.prototype.renderGrid = function() {
      var player, that, x, y, _i, _j, _k, _len, _ref;
      for (x = _i = 0; _i <= 3; x = ++_i) {
        for (y = _j = 0; _j <= 3; y = ++_j) {
          this.grid[x][y].players = [];
        }
      }
      _ref = this.players;
      for (_k = 0, _len = _ref.length; _k < _len; _k++) {
        player = _ref[_k];
        if (player.location) {
          this.grid[player.location.x][player.location.y].players.push(player);
        }
      }
      this.el.html(_.template(App.Templates.HideAndSeek.grid, {
        grid: this.grid,
        player: this.player,
        memes: this.memes,
        forests: this.forests
      }));
      if (this.player.hider && !this.player.hiddenYet) {
        that = this;
        return this.el.find(".HAS-cell").bind("touchstart click", function() {
          return that.hideInCell($(this).closest('.HAS-cell'));
        });
      } else if (this.player.seeker) {
        that = this;
        return this.el.find(".HAS-cell").bind("touchstart click", function() {
          var cell;
          cell = $(this).closest('.HAS-cell');
          x = parseInt(cell.attr('data-x'));
          y = parseInt(cell.attr('data-y'));
          that.inspectCell(x, y);
          return that.broadcast("board: inspect", {
            location: {
              x: x,
              y: y
            }
          });
        });
      }
    };

    HideAndSeek.prototype.hideInCell = function(cell) {
      this.player.hiddenYet = true;
      this.player.location = {
        x: cell.attr('data-x'),
        y: cell.attr('data-y')
      };
      this.broadcast("player: hidden", {
        location: this.player.location
      });
      return this.renderGrid();
    };

    HideAndSeek.prototype.inspectCell = function(x, y) {
      var cell;
      cell = this.grid[x][y];
      cell.inspected = true;
      this.renderGrid();
      if (this.allPlayersDiscovered()) {
        this.gameover();
      }
      if (cell.players.length) {
        return this.notify("" + cell.players[0].name + " bit the dust!");
      } else if (Math.floor(Math.random() < 0.5)) {
        return this.notify(this.taunts[Math.floor(Math.random() * this.taunts.length)]);
      }
    };

    HideAndSeek.prototype.allPlayersDiscovered = function() {
      var player, _i, _len, _ref;
      _ref = this.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.hider && !this.grid[player.location.x][player.location.y].inspected) {
          return false;
        }
      }
      return true;
    };

    HideAndSeek.prototype.receiveBroadcast = function(event, data, player_id) {
      var player;
      if (player_id != null) {
        if (event === 'player: hidden') {
          player = this.getPlayer(player_id);
          player.location = data.location;
          player.hiddenYet = true;
          if (this.player.seeker) {
            if (this.allHidersHidden()) {
              return this.seekerReady();
            }
          } else if (this.player.hiddenYet) {
            return this.renderGrid();
          }
        } else if (event === "board: inspect") {
          return this.inspectCell(data.location.x, data.location.y);
        }
      }
    };

    HideAndSeek.prototype.seekerReady = function() {
      var _this = this;
      this.el.find(".explain").text("Ready to go!");
      return this.el.find(".confirm").show().bind("touchstart click", function() {
        _this.renderGrid();
        return _this.el.find(".notif").text("Start searching!");
      });
    };

    HideAndSeek.prototype.allHidersHidden = function() {
      var player, _i, _len, _ref;
      _ref = this.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.hider && !player.hiddenYet) {
          return false;
        }
      }
      return true;
    };

    HideAndSeek.prototype.proxyFetchReturn = function(json) {
      return this.memes = _.map(json.body.result, function(item) {
        return item.instanceImageUrl;
      });
    };

    HideAndSeek.prototype.gameover = function() {
      var inspected, x, y, _i, _j,
        _this = this;
      inspected = 0;
      for (x = _i = 0; _i <= 3; x = ++_i) {
        for (y = _j = 0; _j <= 3; y = ++_j) {
          if (this.grid[x][y].inspected) {
            inspected++;
          }
        }
      }
      this.notify("Exposed! In only " + inspected + " shots");
      return setTimeout((function() {
        return _this.el.fadeOut(500, function() {
          if (_this.player.seeker) {
            return App.metagame.gameover(16 - inspected);
          } else {
            return App.metagame.gameover(inspected);
          }
        });
      }), 2000);
    };

    return HideAndSeek;

  })(App.Minigames.Default);

  App.metagame.addMinigame(App.Minigames.HideAndSeek);

}).call(this);

// Generated by CoffeeScript 1.4.0
(function() {

  App.Metagame.Default = {};

  App.Metagame.Default.Templates = {
    main_view: '<div id="waiting_room"></div>\n<div id="intro"></div>\n<div id="pregame"></div>\n<div id="scoreboard"></div>\n<div id="countdown"></div>',
    waiting_room: '<h1>Waiting for more players...</h1>\n<h4>\n  <% if (players.length == 1) { %>\n    You&rsquo;re all alone right now! :(\n  <% } else if (players.length == 2) { %>\n    Hooray, a friend has joined you!\n  <% } else if (players.length == 3) { %>\n    You&rsquo;ve got two friends to play with!\n  <% } else if (players.length == 4) { %>\n    Sweet, three other players! This should be fun.\n  <% } else if (players.length == 5) { %>\n    SO MANY PEOPLE. I&rsquo;M FEELING OVERWHELMED.\n  <% } else if (players.length == 6) { %>\n    Look at all these people! It&rsquo;s like the Brady Bunch in here.\n  <% } else if (players.length > 6) { %>\n    Y&rsquo;all ready to PARTY?!?!?\n  <% } %>\n</h4>\n<ul class="player_blocks">\n  <% _.each(players, function(player, index){ %>\n    <% if (index <= 4 || players.length <= 5) { %>\n      <li>\n        <% if (index == 4 && players.length > 5) { %>\n          <br><br>\n          + <%= (players.length - 4) %> others\n        <% } else { %>\n          <div class="color" style="background: <%= player.color%>">\n            <img src="http://cdn1.iconfinder.com/data/icons/gnome-desktop-icons-png/PNG/64/Gnome-Stock-Person-64.png">\n          </div>\n          <%= player.name %>\n        <% } %>\n      </li>\n    <% } %>\n  <% }) %>\n</ul>\n<div style="font-size: 24px">\n  Ready to start playing?\n</div>\n<button>Let&rsquo;s go!</button>',
    intro: '<h1>Let\'s get started!</h1>\n<h4>Loading your first game...</h4>\n<img src="/assets/metagames/default/images/ajax.gif" style="margin: 40px 0 90px">\n<div class="next_game" style="display: none"></div>',
    pregame: '<h1><%= name %></h1>\n<div class="instructions">\n  <h4>Instructions</h4>\n  <%= instructions %>\n</div>\n<div style="font-size: 24px">\n  Waiting for players...\n</div>\n<div class="ready-for-minigame">\n  <% _.each(players, function(player){ %>\n    <div class="player <%= player.ready ? "ready" : "" %>" style="background: <%= player.color %>">\n      <%= player.ready ? "&#10003;" : "&times;" %>\n    </div>\n  <% }) %>\n</div>\n<button>I\'m ready!</button>',
    countdown: 'Game starting in <span>3</span>...',
    scoreboard: '<h1>Scoreboard</h1>\n<table>\n  <tr>\n    <th></th>\n    <th></th>\n    <th>This minigame</th>\n  </tr>\n  <% _.each(players, function(player){ %>\n    <tr>\n      <td><%= player.name %></td>\n      <td><%= player.score %> points</td>\n      <td><%= player.minigame_Score %> points</td>\n    <tr>\n  <% }) %>\n</ul>'
  };

}).call(this);

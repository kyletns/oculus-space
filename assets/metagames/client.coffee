class App.Metagame
  @TEMPLATES = "/assets/metagames/default/templates/templates.js"
  @STYLESHEET = "/assets/metagames/default/css/metagame.css"

  constructor: (@id) ->

  getPlayer: (id) =>
    for player in this.players
      if player.id == id
        return player
    null

  minigames: []

  init: (io, name) =>
    console.log(this.constructor.STYLESHEET);
    $('head').append("<link rel='stylesheet' href='#{this.constructor.STYLESHEET}'>")
    $.getScript(this.constructor.TEMPLATES).done (script, textStatus) =>
      console.log "New metagame with id #{this.id}"
      # create Metagame <div>
      this.el = $("<div>").addClass('active view').attr("id","metagame")
      $('.active.view').removeClass('active').hide()
      $('body').append(this.el)

      # connect to server and listen for players
      this.socket = io.connect("/#{@id}")
      this.socket.emit 'players: player joining', {name: name}
      console.log 'sending JOINING'

      this.socket.on 'players: list updated', (players) =>
        this.players = players
        this.drawPlayerList()

      this.socket.on 'minigame: load', this.minigameLoad

      this.socket.on 'minigame: start', =>
        this.minigames[0].instance.start()

  drawPlayerList: =>
    console.log(this.players)
    this.el.html(_.template(App.Metagame.Default.Templates.main_view, {players: this.players}))

  minigameLoad: (data) =>
    #display loading.gif
    if this.minigames[data.name]
      this.currentMinigame = new this.minigames[data.name]
      this.el.find("#instructions").html(this.currentMinigame.INSTRUCTIONS)
    else
      $.getScript(data.minigame.src).done (script, textStatus) =>
        #remove loading.gif
        this.currentMinigame = new this.minigames[data.name]
        this.el.find("#instructions").html(this.currentMinigame.INSTRUCTIONS)

  addMinigame: (minigame) ->
    this.minigames[minigame.NAME] = minigame

  playerReady: ->
    this.ready = true
    this.socket.emit 'metagame: player ready'
      
# for minigame in App.Metagame.minigames
#   if minigame.name == 'TapRace'
#     minigame.instance = new App.Minigames.TapRace
#     #App.metagame.currentMinigame = 

  gameover: (minigame) ->
    this.socket.emit 'minigame: gameover',
      score: minigame.score
    this.drawPlayerList()
    

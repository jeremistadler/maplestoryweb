
interface OtherPlayer {
  id: string;
  x: number;
  y: number;
  vX: number;
  vY: number;
  isInAir: boolean;
  flipped: boolean;
}

interface PlayerById {
  [id: string]: OtherPlayer;
}

class Networking {
  Players: PlayerById = {};
  socket: SocketIOClient;
  animator: CharacterAnimator;
  nextFrameDate = 0;
  clientId: string;
  allowSending = false;
  lastXPos = 0;
  lastYPos = 0;

  constructor(private ms: IEngine) { }

  init() {
    if (this.ms.isDebug)
      this.socket = io('http://localhost:3000', { 'transports': ['websocket', 'polling'] });
    else
      this.socket = io('http://maplestoryserver.jeremi.se:3000', { 'transports': ['websocket', 'polling'] });

    this.socket.on('connect', () => this.connected());
    this.socket.on('playerState', data => this.onStateRecived(data));
    this.socket.on('players', data => this.onPlayersRecived(data));
    this.socket.on('playerInfo', data => this.onMyInfoRecived(data));
    this.socket.on('disconnect', () => this.disconnected());

    this.animator = new CharacterAnimator(this.ms, 'Character/00002000.img', ['walk1', 'walk2', 'jump', 'stand1', 'stand2']);

    this.ms.map.mapLoadedEvent.on(() => this.onLoadedNewMap());
  }

  makeToken() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  onStateRecived(state: OtherPlayer) {
    if (state.id != this.clientId)
      this.Players[state.id] = state;
  }

  onPlayersRecived(players: OtherPlayer[]) {
    console.log('Received map players: ', players)

    var lookup: PlayerById = {};
    players.forEach(f => lookup[f.id] = this.Players[f.id] || f);
    this.Players = lookup;
  }

  onMyInfoRecived(info: any) {
    this.clientId = info.id;
    console.log('Authenticated!', info)
    this.socket.emit('joinMap', { mapId: this.ms.map.Id.toString() });
    this.allowSending = true;
  }

  connected() {
    console.log('Connected!');

    var token = window.localStorage.getItem('authToken');
    if (!token || true) {
      token = this.makeToken();
      window.localStorage.setItem('authToken', token);
    }
    this.socket.emit('auth', { token: token });
  }

  disconnected() {
    console.log('Disconnected!')
  }

  onLoadedNewMap() {
    this.socket.emit('joinMap', { mapId: this.ms.map.Id.toString() });
  }

  update() {
    if (new Date().getTime() > this.nextFrameDate &&
      this.allowSending &&
      (this.lastXPos != this.ms.player.Position.x ||
        this.lastYPos != this.ms.player.Position.y ||
        new Date().getTime() > this.nextFrameDate + 1000)
      ) {
      this.socket.emit('playerState',
        {
          id: this.clientId,
          x: this.ms.player.Position.x,
          y: this.ms.player.Position.y,
          vX: this.ms.player.Velocity.x,
          vY: this.ms.player.Velocity.y,
          isInAir: this.ms.player.isInAir,
          flipped: this.ms.player.flipped,
          mapId: this.ms.map.Id.toString()
        })

      this.nextFrameDate = new Date().getTime() + 100;
      this.lastXPos = this.ms.player.Position.x;
      this.lastYPos = this.ms.player.Position.y;
    }

    for (var id in this.Players) {
      var player = this.Players[id];
      player.x += player.vX * this.ms.game.frameTime * 0.05;
      player.y += player.vY * this.ms.game.frameTime * 0.05;
    }
  }

  draw() {
    for (var id in this.Players) {
      var p = this.Players[id];

      if (p.isInAir || p.vY > 0)
        this.animator.draw(this.ms.game.ctx, p.x, p.y, p.flipped, 'jump', this.ms.game.frameTime);
      else if (p.vX != 0)
        this.animator.draw(this.ms.game.ctx, p.x, p.y, p.flipped, 'walk1', this.ms.game.frameTime * Math.abs(p.vX / 3));
      else
        this.animator.draw(this.ms.game.ctx, p.x, p.y, p.flipped, 'stand1', this.ms.game.frameTime);
    }
  }
}


interface OtherPlayer {
  id: string;
  x: number;
  y: number;
  vX: number;
  vY: number;
  isInAir: boolean;
}

interface PlayerById {
  [id: string]: OtherPlayer;
}

class Networking {
  Players: PlayerById = {};
  socket: SocketIOClient;
  animator: CharacterAnimator;
  sendNextFrame = true;
  nextFrameDate = 0;
  clientId: string;

  constructor(private ms: IEngine) { }

  init() {
    this.clientId = this.makeId();
    this.socket = io('http://maplestoryserver.jeremi.se', { 'transports': ['polling'] });

    this.socket.on('connect', () => this.connected());
    this.socket.on('playerState', data => this.onStateRecived(data));
    this.socket.on('disconnect', () => this.disconnected());

    this.animator = new CharacterAnimator(this.ms, 'Character/00002000.img', ['walk1', 'walk2', 'jump', 'stand1', 'stand2']);
  }

  makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  onStateRecived(state: OtherPlayer) {
    if (state.id == this.clientId)
      this.sendNextFrame = true;
    else
      this.Players[state.id] = state;
  }

  connected() {

  }

  disconnected() {

  }

  update() {
    if (this.sendNextFrame && new Date().getTime() > this.nextFrameDate) {
      this.socket.emit('playerState',
        {
          id: this.clientId,
          x: this.ms.player.Position.x,
          y: this.ms.player.Position.y,
          vX: this.ms.player.Velocity.x,
          vY: this.ms.player.Velocity.y,
          isInAir: this.ms.player.isInAir
        })

      this.sendNextFrame = false;
      this.nextFrameDate = new Date().getTime() + 100;
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
        this.animator.draw(this.ms.game.ctx, p.x, p.y, p.vX > 0, 'jump', this.ms.game.frameTime);
      else if (p.vX != 0)
        this.animator.draw(this.ms.game.ctx, p.x, p.y, p.vX > 0, 'walk1', this.ms.game.frameTime * Math.abs(p.vX / 3));
      else
        this.animator.draw(this.ms.game.ctx, p.x, p.y, p.vX > 0, 'stand1', this.ms.game.frameTime);
    }
  }
}

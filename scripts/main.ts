
class Game {
  public ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  public totalGameTime: number;
  public lastGameTime: number;
  public frameTime: number;

	constructor(private ms: IEngine){}

  init() {
    this.canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d', { alpha: false });
    this.ctx.font = '12px Segoe UI';

    this.totalGameTime = Date.now();
    this.lastGameTime = this.totalGameTime - 20;
    this.frameTime = 20;
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  update() {
    this.ms.http.update();
    this.lastGameTime = this.totalGameTime;
    this.totalGameTime = Date.now();
    this.frameTime = this.totalGameTime - this.lastGameTime;
    this.ms.camera.update();
    this.ms.map.update();
    this.ms.player.update();
    this.ms.ui.update();
  }

  draw() {
    if (!this.ms.map.loaded) return;

    this.ms.camera.reset();
    this.ctx.fillStyle = 'cornflowerblue';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ms.camera.draw();
    this.ms.map.draw();

    //// Draw everything shrinked for debug
    //this.ctx.translate(this.ms.camera.boundsLeft + 400, this.ms.camera.boundsTop + 400);
    //this.ctx.scale(0.1, 0.1);
    //    this.ms.map.draw();
    //    this.ms.player.draw();
    //this.ctx.strokeStyle = "red";
    //this.ctx.lineWidth = 10;
    //this.ctx.strokeRect(this.ms.camera.boundsLeft, this.ms.camera.boundsTop, this.ms.camera.width, this.ms.camera.height);
    //this.ctx.lineWidth = 1;


    this.ms.fps.draw(this.ctx);
  }
}

interface IEngine {
	game: Game;
	camera: Camera;
	map: World;
	player: Player;
	http: HttpManager;
	ui: UI;
	sound: SoundPlayer;
	fps: Fps;
  isDebug: boolean;
}

class Engine {
  public game: Game = new Game(this);
  public camera: Camera = new Camera(this);
  public map: World = new World(this);
  public player: Player = new Player(this);
  public http: HttpManager = new HttpManager();
  public ui: UI = new UI(this);
  public sound: SoundPlayer = new SoundPlayer(this);
  public fps: Fps = new Fps(this);
  public isDebug = window.location.hostname == 'localhost';

  gotAnimationFrame() {
    requestAnimationFrame(() => this.gotAnimationFrame());

    this.game.update();
    this.game.draw();
  }

  run() {
    this.game.init();
    this.camera.init();
    this.player.init();
    this.ui.init();
    this.sound.init();

    //this.map.loadMap(101000000, null); // elina
    this.map.loadMap(100000000, null); // henesys

		window.addEventListener('resize', () => this.game.resize(), false);
    this.game.resize();
    this.gotAnimationFrame();
  }
}

window.engine = new Engine();
window.engine.run();

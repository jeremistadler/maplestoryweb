/// <reference path="libs/jquery/jquery.d.ts" />

/// <reference path="world.ts" />
/// <reference path="vector.ts" />
/// <reference path="player.ts" />
/// <reference path="texture.ts" />
/// <reference path="foothold.ts" />
/// <reference path="camera.ts" />
/// <reference path="portal.ts" />
/// <reference path="UI.ts" />
/// <reference path="http-manager.ts" />
/// <reference path="tiles/static-tile.ts" />
/// <reference path="tiles/background-tile.ts" />
/// <reference path="tiles/animated-tile.ts" />

class Game {
	public ctx : CanvasRenderingContext2D;
	public canvas : HTMLCanvasElement;
	public totalGameTime: number;
	public lastGameTime: number;
	public frameTime : number;
	
	init() {
		this.canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.ctx = this.canvas.getContext('2d', { alpha: false });
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
		ms.http.update();
		this.lastGameTime = this.totalGameTime;
		this.totalGameTime = Date.now();
		this.frameTime = this.totalGameTime - this.lastGameTime;
		ms.camera.update();
		ms.map.update();
        ms.player.update();
        ms.ui.update();
	}

	draw() {
        ms.camera.reset();
		this.ctx.fillStyle = 'rgb(100, 149, 237)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
        ms.camera.draw();
        ms.map.draw();
        ms.player.draw();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(this.canvas.width / 2, 100);
        this.ctx.scale(0.1, 0.1);
        ms.map.draw();
	}
}

class Engine {
    public game: Game = new Game();
    public camera: Camera = new Camera();
    public map: World = new World();
    public player: Player = new Player();
    public http: HttpManager = new HttpManager();
    public ui: UI = new UI();

    run() {
        this.game.init();
        this.camera.init();
        this.player.init();
        this.ui.init();

        this.map.loadMap(100000000, null);

        $(window).resize(function () {
            ms.game.resize();
        });

        function gotAnimationFrame() {
            requestAnimationFrame(gotAnimationFrame);

            ms.game.update();
            ms.game.draw();
        }
        gotAnimationFrame();
    }
}

var ms = new Engine();
ms.run();
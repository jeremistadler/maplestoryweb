class Size {
	constructor(public width: number, public height: number) { }
	
	static get zero(): Size {
		return new Size(0, 0);
	}
}

class Vector {
	constructor(public x: number, public y: number) { }
	static times(k: number, v: Vector) { return new Vector(k * v.x, k * v.y); }
	static minus(v1: Vector, v2: Vector) { return new Vector(v1.x - v2.x, v1.y - v2.y); }
	static plus(v1: Vector, v2: Vector) { return new Vector(v1.x + v2.x, v1.y + v2.y); }
	static dot(v1: Vector, v2: Vector) { return v1.x * v2.x + v1.y * v2.y; }
	static mag(v: Vector) { return Math.sqrt(v.x * v.x + v.y * v.y); }
	static norm(v: Vector) {
		var mag = Vector.mag(v);
		var div = (mag === 0) ? Infinity : 1.0 / mag;
		return Vector.times(div, v);
	}
	static get Zero(): Vector {
		return new Vector(0, 0);
	}
}

class Foothold {
	constructor(public Position : Vector, public Size : Size){ }
	
	draw(ctx : CanvasRenderingContext2D){
		ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
		ctx.fillRect(this.Position.x, this.Position.y, this.Size.width, this.Size.height);
	}
}

enum KeyCodes { 
	left = 37,
	right = 39,
	up = 38,
	down = 40,
	enter = 13
 }

class Texture {
	image : HTMLImageElement;
	hasLoaded : boolean;
	hasError : boolean;
	
	constructor(path : string){
		this.image = new Image();
		this.image.src = path;
		
		var instance = this;
		this.image.onload = () => instance.hasLoaded = true;
		this.image.onerror = () => instance.hasError = true;
	}
	
	draw(ctx : CanvasRenderingContext2D, pos : Vector, size? : Vector) {
		if (this.hasError){
			size = size || new Vector(100, 100);
			ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
			ctx.fillRect(pos.x, pos.y, size.x, size.y);
			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillText('error...', pos.x + 10, pos.y + 10);
			return;
		}
		
		if (!this.hasLoaded){
			size = size || new Vector(100, 100);
			ctx.fillStyle = 'rgba(0, 0, 200, 0.2)';
			ctx.fillRect(pos.x, pos.y, size.x, size.y);
			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillText('loading...', pos.x, pos.y);
			return;
		}
		
		if (size == null)
			ctx.drawImage(this.image, pos.x, pos.y, 
						  this.image.width, this.image.height);	
		else
			ctx.drawImage(this.image, pos.x, pos.y, 
						  size.x, size.y);	
	}
}

class Camera {
	Position : Vector;
	Zoom: number = 1;
	
	init() {
		this.Position = new Vector(0, 0);
	}
	update() {
		var targetPos = new Vector(0, 0);
		targetPos.x = player.Position.x + -game.canvas.width / 2 - player.Size.x / 2;
		
		//this.Position = targetPos;
		
		game.ctx.setTransform(1, 0, 0, 1, 0, 0);
		game.ctx.translate(this.Position.x, this.Position.y);
		game.ctx.scale(this.Zoom, this.Zoom);
	}
	draw() { }
}

class Player {
	image : Texture;
	Position : Vector;
	Velocity : Vector;
	Size : Vector;
	
	init() {
		this.Position = new Vector(0, 0);
		this.Velocity = new Vector(0, 0);
		this.Size = new Vector(60, 80);
		this.image = new Texture('http://nxcache.nexon.net/spotlight/112/007kn-7e9ea6e9-e3c1-402e-803d-7df82ad5ac53.gif');
	
		var instance = this;
		window.onkeydown = (e) => instance.onKeyDown(e);
		window.onkeyup = (e) => instance.onKeyUp(e);
	}
	
	onKeyDown(e : KeyboardEvent){
		if (e.keyCode == KeyCodes.left)
			this.Velocity.x = -1;
		else if (e.keyCode == KeyCodes.right)
			this.Velocity.x = 1;
		  
		if (e.keyCode == KeyCodes.down) { debugger; }
		if (e.keyCode == KeyCodes.up) { }
	}
	
	onKeyUp(e : KeyboardEvent){
		if (e.keyCode == KeyCodes.left && this.Velocity.x < 0) // left
			this.Velocity.x = 0;
		else if (e.keyCode == KeyCodes.right && this.Velocity.x > 0) // right
			this.Velocity.x = 0;
	}
	
	update() {
		this.Position = Vector.plus(this.Position, this.Velocity);
	}
	
	draw() {
		this.image.draw(game.ctx, this.Position, this.Size);
	}
}

class World {
	Background : Texture;
	Footholds : Foothold[];
	
	init() {
		this.Background = new Texture('http://fc09.deviantart.net/fs25/f/2008/086/e/e/Render__Henesys_by_iChicken.png');
	
		this.Footholds = [];
		for (var i = 0; i < 10; i++)
			this.Footholds.push(new Foothold(
				new Vector(Math.random() * 800, Math.random() * 800), 
				new Size(Math.random() * 500, 100)))
	}
	update() { }
	draw() {
		this.Background.draw(game.ctx, Vector.Zero);
		
		for (var i = 0; i < this.Footholds.length; i++)
			this.Footholds[i].draw(game.ctx);
	}
}
   
class Game {
	public ctx : CanvasRenderingContext2D;
	public canvas : HTMLCanvasElement;
	
	init() {
		this.canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx = this.canvas.getContext('2d', { alpha: false });
	}
		
	update() {
		camera.update();
		map.update();
		player.update();
	}
	draw() {
		this.ctx.fillStyle = 'rgb(100, 149, 237)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		camera.draw();
		map.draw();
		player.draw();
	}
}


var game = new Game();
var camera = new Camera();
var map = new World();
var player = new Player();

game.init();
camera.init();
map.init();
player.init();

function gotAnimationFrame() {
	requestAnimationFrame(gotAnimationFrame);
	
	game.update();
	game.draw();
}
gotAnimationFrame();

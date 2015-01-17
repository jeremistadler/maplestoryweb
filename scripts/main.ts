/// <reference path="sprites.ts"/>
/// <reference path="vector.ts"/>

// http://fc09.deviantart.net/fs25/f/2008/086/e/e/Render__Henesys_by_iChicken.png

enum PortalTypeNames { 
    "Start Point",
    "Invisible",
    "Visible",
    "Collision",
    "Changable",
    "Changable Invisible",
    "Town Portal", 
    "Script",
    "Script Invisible",
    "Script Collision",
    "Hidden",
    "Script Hidden",
    "Vertical Spring",
    "Custom Impact Spring",
    "Unknown (PCIG)" };

enum BackgroundTypeNames {
    "Regular",
    "Horizontal Copies",
    "Vertical Copies",
    "H+V Copies",
    "Horizontal Moving+Copies",
    "Vertical Moving+Copies",
    "H+V Copies, Horizontal Moving",
    "H+V Copies, Vertical Moving"
};

class Foothold {
    playerTouches: boolean;

    constructor(public Position: Vector, public Size: Size) { }

    static loadFootholds(current): Foothold[] {
        var list = [];
        if (current.x1) {
            var pos1 = new Vector(current.x1, current.y1);
            var pos2 = new Vector(current.x2, current.y2);
            var min = Vector.min(pos1, pos2);
            var max = Vector.max(pos1, pos2);
            list.push(new Foothold(new Vector(min.x, min.y), new Size(max.x - min.x, max.y - min.y)));
        }
        else {
            for (var key in current) {
                list = list.concat(Foothold.loadFootholds(current[key]));
            }
        }

        return list;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.isWall()) {
            ctx.moveTo(this.Position.x, this.Position.y);
            ctx.lineTo(this.Position.x + this.Size.width, this.Position.y + this.Size.height);
        }
        else
		    ctx.rect(this.Position.x, this.Position.y, this.Size.width, this.Size.height);
    }

    isWall() {
        return this.Size.height == 0 || this.Size.width == 0;
    }

    isPointColliding(point: Vector, velocity: Vector): boolean {
        return (
            this.Position.x <= point.x &&
            this.Position.x + this.Size.width >= point.x &&
            this.Position.y >= point.y &&
            this.Position.y <= point.y + velocity.y &&
            true);
    }
}
 
enum KeyCodes { 
	left = 37,
	right = 39,
	up = 38,
	down = 40,
    enter = 13,
    space = 32
 }

class Texture {
	image : HTMLImageElement;
	hasLoaded : boolean;
	hasError : boolean;
	
	constructor(path : string){
		this.image = new Image();
		this.image.src = path;
		
		var instance = this;
        this.image.onload = () => { instance.hasLoaded = true; }
		this.image.onerror = () => instance.hasError = true;
	}
	
	draw(ctx : CanvasRenderingContext2D, pos : Vector, size? : Size) {
		if (this.hasError){
            size = size || new Size(100, 100);
			ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
			ctx.fillRect(pos.x, pos.y, size.width, size.height);
			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillText('error...', pos.x + 10, pos.y + 10);
			return;
		}
		
		if (!this.hasLoaded){
            size = size || new Size(100, 100);
			ctx.fillStyle = 'rgba(0, 0, 200, 0.2)';
            ctx.fillRect(pos.x, pos.y, size.width, size.height);
			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.fillText('loading...', pos.x, pos.y);
			return;
        }

		if (size == null)
			ctx.drawImage(this.image, pos.x, pos.y, this.image.width, this.image.height);	
		else
            ctx.drawImage(this.image, pos.x, pos.y, size.width, size.height);


        if (size == null)
            size = new Size(this.image.width, this.image.height);

        ctx.strokeStyle = 'rgba(0, 200, 0, 1)';
        ctx.strokeRect(pos.x, pos.y, size.width, size.height);
	}
}

class Camera {
	Position : Vector;
	Zoom: number = 1;
	
	init() {
		this.Position = new Vector(0, 0);
	}

    reset() {
        game.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

	update() {
		var targetPos = new Vector(0, 0);
        targetPos.x = player.Position.x + -game.canvas.width / 2 - player.Size.width / 2;
        targetPos.y = player.Position.y + -game.canvas.height / 2 - player.Size.height / 2;
		
		this.Position = Vector.lerp(this.Position, targetPos, 0.04);
	}
    draw() {
        this.reset();
        game.ctx.translate(-this.Position.x, -this.Position.y);
        game.ctx.scale(this.Zoom, this.Zoom);
    }
}

class Player {
	image : Texture;
	Position : Vector;
	Velocity : Vector;
    Size: Size;
    hasJumped: boolean;
	
	init() {
		this.Position = new Vector(500, 450);
		this.Velocity = new Vector(0, 0);
        this.Size = new Size(60, 80);
		this.image = new Texture('http://nxcache.nexon.net/spotlight/112/007kn-7e9ea6e9-e3c1-402e-803d-7df82ad5ac53.gif');
        this.hasJumped = true;

		var instance = this;
		window.onkeydown = (e) => instance.onKeyDown(e);
		window.onkeyup = (e) => instance.onKeyUp(e);
	}
	
	onKeyDown(e : KeyboardEvent){
		if (e.keyCode == KeyCodes.left)
			this.Velocity.x = -3;
		else if (e.keyCode == KeyCodes.right)
			this.Velocity.x = 3;
		  
        if (e.keyCode == KeyCodes.down) { this.Position.y++; this.Velocity.y++; }
        if (e.keyCode == KeyCodes.up) { }
        if (e.keyCode == KeyCodes.space) {
            if (this.hasJumped == false) {
                this.Velocity.y -= 8;
                this.hasJumped = true;
            }
        }
	}
	
	onKeyUp(e : KeyboardEvent){
		if (e.keyCode == KeyCodes.left && this.Velocity.x < 0) // left
			this.Velocity.x = 0;
		else if (e.keyCode == KeyCodes.right && this.Velocity.x > 0) // right
			this.Velocity.x = 0;
	}
	
    update() {
        if (!map.loaded) return;

        this.Velocity.y += 0.3;

        for (var i = 0; i < map.Footholds.length; i++)
            map.Footholds[i].playerTouches = false;
        
         
        for (var i = 0; i < map.Footholds.length; i++) {
            if (map.Footholds[i].isPointColliding(Vector.plus(this.Position, new Vector(-this.Size.width / 2, 0)), this.Velocity) ||
                map.Footholds[i].isPointColliding(Vector.plus(this.Position, new Vector(this.Size.width / 2, 0)), this.Velocity)) {
                map.Footholds[i].playerTouches = true;
                this.Velocity.y = 0;
                this.Position.y = map.Footholds[i].Position.y;
                this.hasJumped = false;
            }
        }

        this.Position = Vector.plus(this.Position, this.Velocity);

        if (this.Position.y > 1000) {
            this.Position.y = 0;
            this.Velocity.y = 0;
        }
    }
	
	draw() {
        this.image.draw(game.ctx, new Vector(this.Position.x - this.Size.width / 2, this.Position.y - this.Size.height), this.Size);
        game.ctx.beginPath();
        game.ctx.strokeStyle = "black";
        game.ctx.moveTo(this.Position.x - 5, this.Position.y);
        game.ctx.lineTo(this.Position.x + 5, this.Position.y);
        game.ctx.moveTo(this.Position.x, this.Position.y + 5);
        game.ctx.lineTo(this.Position.x, this.Position.y - 5);
        game.ctx.stroke();

        game.ctx.fillStyle = 'black';
        game.ctx.fillText('x: ' + Math.round(this.Position.x) + ', y: ' + Math.round(this.Position.y), this.Position.x - 30, this.Position.y - 100);
	}
}


class World {
    Footholds: Foothold[] = [];
    Id: string;
    BasePath: string;
    Backgrounds: BackgroundSprite[] = [];
    Animations: AnimationSprite[] = [];
    Tiles: Tile[] = [];
    loaded: boolean = false;

	init(id: string) {
        this.Id = id;
        this.BasePath = 'Map/Map/Map' + this.Id.substr(0, 1) + '/' + this.Id + '.img/';
        var instance = this;
        http.httpGetAsset(this.BasePath + 'properties.json', function (data) { instance.loadData(data) });
	    
	}

    loadData(mapData) {
        this.Footholds = Foothold.loadFootholds(mapData.foothold);

        for (var key in mapData.back) {
            var item = mapData.back[key];
            var bg = new BackgroundSprite();
            bg.Sprite = new TextureSprite('Map/Back/' + item.bS + '.img/back/' + item.no);
            bg.Position = new Vector(item.x, item.y);
            bg.C = new Vector(item.cx, item.cy);
            bg.R = new Vector(item.rx, item.ry);
            if (item.type.type == 0) bg.Type = BackgroundType.LensFlare;
            else bg.Type = BackgroundType.unknown6;

            this.Backgrounds.push(bg);
        }

        for (var key in mapData) {
            var layer = mapData[key];
            if (!layer.info || !layer.info.tS)
                continue;

            var spriteBaseNameProp = <string>layer.info.tS;
            var spriteBaseName = spriteBaseNameProp;

            for (var tileKey in layer.tile) {
                var item = layer.tile[tileKey];
                var x = item.x;
                var y = item.y;
                var z = item.zM;
                var u = item.u;
                var no = item.no;

                var tile = new Tile();
                tile.Sprite = new TextureSprite('Map/Tile/' + spriteBaseName + '.img/' + u + '/' + no);
                tile.Position = new Vector(x, y);
                tile.Z = z;
                this.Tiles.push(tile);
            }
            this.Tiles.sort((a, b) => b.Z - a.Z);

            for (var objKey in layer["obj"]) {
                var item = layer["obj"][objKey];
                var x = item.x;
                var y = item.y;
                var z = item.zM;

                var u = item.oS;
                var l0 = item.l0;
                var l1 = item.l1;
                var l2 = item.l2;

                var spriteName = "Map/Obj/" + u + ".img/" + l0 + "/" + l1 + "/" + l2;
                var animation = new AnimationSprite(spriteName, new Vector(x, y));
                animation.Z = z;
                this.Animations.push(animation);
            }

            this.Animations.sort((a, b) => a.Z - b.Z);
        }

        this.loaded = true;
    }

	update() { }
    draw() {
        //for (var i = 0; i < this.Backgrounds.length; i++)
        //    this.Backgrounds[i].draw(game.ctx);



        for (var i = 0; i < this.Animations.length; i++)
            this.Animations[i].draw(game.ctx);

        for (var i = 0; i < this.Tiles.length; i++)
            this.Tiles[i].draw(game.ctx);

        game.ctx.beginPath();
        game.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        game.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        game.ctx.lineWidth = 1;
		for (var i = 0; i < this.Footholds.length; i++)
            this.Footholds[i].draw(game.ctx);
        game.ctx.fill();
        game.ctx.stroke();

        game.ctx.beginPath();
        game.ctx.fillStyle = 'rgba(200, 0, 0, 0.3)';
        game.ctx.strokeStyle = 'rgba(200, 0, 0, 0.5)';
        game.ctx.lineWidth = 1;
        for (var i = 0; i < this.Footholds.length; i++)
            if (this.Footholds[i].playerTouches)
                this.Footholds[i].draw(game.ctx);
        game.ctx.fill();
        game.ctx.stroke();
	}
}


class Game {
	public ctx : CanvasRenderingContext2D;
	public canvas : HTMLCanvasElement;
    public totalGameTime : number;
	
	init() {
		this.canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx = this.canvas.getContext('2d', { alpha: false });
	}
		
	update() {
        http.update();
        this.totalGameTime = Date.now();
		camera.update();
		map.update();
		player.update();
	}
	draw() {
        camera.reset();
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
var http = new HttpManager();

game.init();
camera.init();
player.init();
map.init('100000200');


function gotAnimationFrame() {
	requestAnimationFrame(gotAnimationFrame);
	
	game.update();
	game.draw();
}
gotAnimationFrame();

angular.module('maplestory', [])
.controller('minimap', function ($scope) {
    $scope.map = {
        name: 'Henesys',
        minimap: {
            background: '/images/image-placeholder.png'
        }
    }
})


/// <reference path="sprites.ts"/>
/// <reference path="vector.ts"/>
var Foothold = (function () {
    function Foothold(Position, Size) {
        this.Position = Position;
        this.Size = Size;
    }
    Foothold.loadFootholds = function (current) {
        var list = [];
        if (current.x1) {
            var pos1 = new Vector(current.x1.x1, current.y1.y1);
            var pos2 = new Vector(current.x2.x2, current.y2.y2);
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
    };
    Foothold.prototype.draw = function (ctx) {
        ctx.fillStyle = this.playerTouches ? 'rgba(100, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(this.Position.x, this.Position.y, this.Size.width, this.Size.height);
    };
    Foothold.prototype.isPointColliding = function (point, velocity) {
        return (this.Position.x <= point.x && this.Position.x + this.Size.width >= point.x && this.Position.y >= point.y && this.Position.y <= point.y + velocity.y && true);
    };
    return Foothold;
})();
var KeyCodes;
(function (KeyCodes) {
    KeyCodes[KeyCodes["left"] = 37] = "left";
    KeyCodes[KeyCodes["right"] = 39] = "right";
    KeyCodes[KeyCodes["up"] = 38] = "up";
    KeyCodes[KeyCodes["down"] = 40] = "down";
    KeyCodes[KeyCodes["enter"] = 13] = "enter";
    KeyCodes[KeyCodes["space"] = 32] = "space";
})(KeyCodes || (KeyCodes = {}));
var Texture = (function () {
    function Texture(path) {
        this.image = new Image();
        this.image.src = path;
        var instance = this;
        this.image.onload = function () { return instance.hasLoaded = true; };
        this.image.onerror = function () { return instance.hasError = true; };
    }
    Texture.prototype.draw = function (ctx, pos, size) {
        if (this.hasError) {
            size = size || new Size(100, 100);
            ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
            ctx.fillRect(pos.x, pos.y, size.width, size.height);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillText('error...', pos.x + 10, pos.y + 10);
            return;
        }
        if (!this.hasLoaded) {
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
    };
    return Texture;
})();
var Camera = (function () {
    function Camera() {
        this.Zoom = 1;
    }
    Camera.prototype.init = function () {
        this.Position = new Vector(0, 0);
    };
    Camera.prototype.reset = function () {
        game.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    Camera.prototype.update = function () {
        var targetPos = new Vector(0, 0);
        targetPos.x = player.Position.x + -game.canvas.width / 2 - player.Size.width / 2;
        targetPos.y = player.Position.y + -game.canvas.height / 2 - player.Size.height / 2;
        this.Position = targetPos;
        this.reset();
        game.ctx.translate(-this.Position.x, -this.Position.y);
        game.ctx.scale(this.Zoom, this.Zoom);
    };
    Camera.prototype.draw = function () {
    };
    return Camera;
})();
var Player = (function () {
    function Player() {
    }
    Player.prototype.init = function () {
        this.Position = new Vector(500, 0);
        this.Velocity = new Vector(0, 0);
        this.Size = new Size(60, 80);
        this.image = new Texture('http://nxcache.nexon.net/spotlight/112/007kn-7e9ea6e9-e3c1-402e-803d-7df82ad5ac53.gif');
        this.hasJumped = true;
        var instance = this;
        window.onkeydown = function (e) { return instance.onKeyDown(e); };
        window.onkeyup = function (e) { return instance.onKeyUp(e); };
    };
    Player.prototype.onKeyDown = function (e) {
        if (e.keyCode == 37 /* left */)
            this.Velocity.x = -3;
        else if (e.keyCode == 39 /* right */)
            this.Velocity.x = 3;
        if (e.keyCode == 40 /* down */) {
            this.Position.y++;
            this.Velocity.y++;
        }
        if (e.keyCode == 38 /* up */) {
        }
        if (e.keyCode == 32 /* space */) {
            if (this.hasJumped == false) {
                this.Velocity.y -= 8;
                this.hasJumped = true;
            }
        }
    };
    Player.prototype.onKeyUp = function (e) {
        if (e.keyCode == 37 /* left */ && this.Velocity.x < 0)
            this.Velocity.x = 0;
        else if (e.keyCode == 39 /* right */ && this.Velocity.x > 0)
            this.Velocity.x = 0;
    };
    Player.prototype.update = function () {
        this.Velocity.y += 0.3;
        for (var i = 0; i < map.Footholds.length; i++)
            map.Footholds[i].playerTouches = false;
        for (var i = 0; i < map.Footholds.length; i++) {
            if (map.Footholds[i].isPointColliding(Vector.plus(this.Position, new Vector(-this.Size.width / 2, 0)), this.Velocity) || map.Footholds[i].isPointColliding(Vector.plus(this.Position, new Vector(this.Size.width / 2, 0)), this.Velocity)) {
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
    };
    Player.prototype.draw = function () {
        this.image.draw(game.ctx, new Vector(this.Position.x - this.Size.width / 2, this.Position.y - this.Size.height), this.Size);
        game.ctx.beginPath();
        game.ctx.strokeStyle = "black";
        game.ctx.moveTo(this.Position.x - 5, this.Position.y);
        game.ctx.lineTo(this.Position.x + 5, this.Position.y);
        game.ctx.moveTo(this.Position.x, this.Position.y + 5);
        game.ctx.lineTo(this.Position.x, this.Position.y - 5);
        game.ctx.stroke();
    };
    return Player;
})();
var World = (function () {
    function World() {
    }
    World.prototype.init = function (id) {
        this.Tiles = [];
        this.Backgrounds = [];
        this.Footholds = [];
        this.Id = id;
        this.BasePath = 'Map/Map' + this.Id.substr(0, 1) + '/' + this.Id + '.img/';
        var instance = this;
        http.httpGetAsset(this.BasePath + 'properties.json', function (data) {
            instance.loadData(data);
        });
    };
    World.prototype.loadData = function (mapData) {
        this.Footholds = Foothold.loadFootholds(mapData.foothold);
        for (var key in mapData.back) {
            var item = mapData.back[key];
            var bg = new BackgroundSprite();
            bg.Sprite = new TextureSprite('Back/' + item.bS.bS + '.img/back/' + item.no.no);
            bg.Position = new Vector(item.x.x, item.y.y);
            bg.C = new Vector(item.cx, item.cy);
            bg.R = new Vector(item.rx, item.ry);
            if (item.type.type == 0)
                bg.Type = 0 /* LensFlare */;
            else
                bg.Type = 5 /* unknown6 */;
            this.Backgrounds.push(bg);
        }
        for (var key in mapData) {
            var layer = mapData[key];
            if (!layer.info || !layer.info.tS)
                continue;
            var spriteBaseNameProp = layer.info.tS.tS;
            var spriteBaseName = spriteBaseNameProp;
            for (var tileKey in layer.tile) {
                var item = layer.tile[tileKey];
                var x = item.x.x;
                var y = item.y.y;
                var z = item.zM.zM;
                var u = item.u.u;
                var no = item.no.no;
                var tile = new Tile();
                tile.Sprite = new TextureSprite('Tile/' + spriteBaseName + '.img/' + u + '/' + no);
                tile.Position = new Vector(x, y);
                tile.Z = z;
                this.Tiles.push(tile);
            }
            for (var objKey in layer["obj"]) {
                var x = item.x;
                var y = item.y;
                var z = item.zM;
                var u = item.oS;
                var l0 = item.l0;
                var l1 = item.l1;
                var l2 = item.l2;
            }
        }
    };
    World.prototype.update = function () {
    };
    World.prototype.draw = function () {
        for (var i = 0; i < this.Tiles.length; i++)
            this.Tiles[i].draw(game.ctx);
        for (var i = 0; i < this.Footholds.length; i++)
            this.Footholds[i].draw(game.ctx);
    };
    return World;
})();
var Game = (function () {
    function Game() {
    }
    Game.prototype.init = function () {
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d', { alpha: false });
    };
    Game.prototype.update = function () {
        http.update();
        this.totalGameTime = Date.now();
        map.update();
        player.update();
    };
    Game.prototype.draw = function () {
        camera.reset();
        this.ctx.fillStyle = 'rgb(100, 149, 237)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        camera.update();
        map.draw();
        player.draw();
    };
    return Game;
})();
var game = new Game();
var camera = new Camera();
var map = new World();
var player = new Player();
var http = new HttpManager();
game.init();
camera.init();
player.init();
map.init('100000000');
function gotAnimationFrame() {
    requestAnimationFrame(gotAnimationFrame);
    game.update();
    game.draw();
}
gotAnimationFrame();
var Size = (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Size, "zero", {
        get: function () {
            return new Size(0, 0);
        },
        enumerable: true,
        configurable: true
    });
    return Size;
})();
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.times = function (k, v) {
        return new Vector(k * v.x, k * v.y);
    };
    Vector.minus = function (v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    };
    Vector.plus = function (v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    };
    Vector.dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    };
    Vector.mag = function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    };
    Vector.norm = function (v) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    };
    Object.defineProperty(Vector, "Zero", {
        get: function () {
            return new Vector(0, 0);
        },
        enumerable: true,
        configurable: true
    });
    return Vector;
})();
var Foothold = (function () {
    function Foothold(Position, Size) {
        this.Position = Position;
        this.Size = Size;
    }
    Foothold.prototype.draw = function (ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(this.Position.x, this.Position.y, this.Size.width, this.Size.height);
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
            size = size || new Vector(100, 100);
            ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
            ctx.fillRect(pos.x, pos.y, size.x, size.y);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillText('error...', pos.x + 10, pos.y + 10);
            return;
        }
        if (!this.hasLoaded) {
            size = size || new Vector(100, 100);
            ctx.fillStyle = 'rgba(0, 0, 200, 0.2)';
            ctx.fillRect(pos.x, pos.y, size.x, size.y);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillText('loading...', pos.x, pos.y);
            return;
        }
        if (size == null)
            ctx.drawImage(this.image, pos.x, pos.y, this.image.width, this.image.height);
        else
            ctx.drawImage(this.image, pos.x, pos.y, size.x, size.y);
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
    Camera.prototype.update = function () {
        var targetPos = new Vector(0, 0);
        targetPos.x = player.Position.x + -game.canvas.width / 2 - player.Size.x / 2;
        //this.Position = targetPos;
        game.ctx.setTransform(1, 0, 0, 1, 0, 0);
        game.ctx.translate(this.Position.x, this.Position.y);
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
        this.Position = new Vector(0, 0);
        this.Velocity = new Vector(0, 0);
        this.Size = new Vector(60, 80);
        this.image = new Texture('http://nxcache.nexon.net/spotlight/112/007kn-7e9ea6e9-e3c1-402e-803d-7df82ad5ac53.gif');
        var instance = this;
        window.onkeydown = function (e) { return instance.onKeyDown(e); };
        window.onkeyup = function (e) { return instance.onKeyUp(e); };
    };
    Player.prototype.onKeyDown = function (e) {
        if (e.keyCode == 37 /* left */)
            this.Velocity.x = -1;
        else if (e.keyCode == 39 /* right */)
            this.Velocity.x = 1;
        if (e.keyCode == 40 /* down */) {
            debugger;
        }
        if (e.keyCode == 38 /* up */) {
        }
    };
    Player.prototype.onKeyUp = function (e) {
        if (e.keyCode == 37 /* left */ && this.Velocity.x < 0)
            this.Velocity.x = 0;
        else if (e.keyCode == 39 /* right */ && this.Velocity.x > 0)
            this.Velocity.x = 0;
    };
    Player.prototype.update = function () {
        this.Position = Vector.plus(this.Position, this.Velocity);
    };
    Player.prototype.draw = function () {
        this.image.draw(game.ctx, this.Position, this.Size);
    };
    return Player;
})();
var World = (function () {
    function World() {
    }
    World.prototype.init = function () {
        this.Background = new Texture('http://fc09.deviantart.net/fs25/f/2008/086/e/e/Render__Henesys_by_iChicken.png');
        this.Footholds = [];
        for (var i = 0; i < 10; i++)
            this.Footholds.push(new Foothold(new Vector(Math.random() * 800, Math.random() * 800), new Size(Math.random() * 500, 100)));
    };
    World.prototype.update = function () {
    };
    World.prototype.draw = function () {
        this.Background.draw(game.ctx, Vector.Zero);
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
        camera.update();
        map.update();
        player.update();
    };
    Game.prototype.draw = function () {
        this.ctx.fillStyle = 'rgb(100, 149, 237)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        camera.draw();
        map.draw();
        player.draw();
    };
    return Game;
})();
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

/// <reference path="sprites.ts"/>
/// <reference path="vector.ts"/>
/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/angular/angular.d.ts" />
// http://fc09.deviantart.net/fs25/f/2008/086/e/e/Render__Henesys_by_iChicken.png
var PortalTypeNames;
(function (PortalTypeNames) {
    PortalTypeNames[PortalTypeNames["Start Point"] = 0] = "Start Point";
    PortalTypeNames[PortalTypeNames["Invisible"] = 1] = "Invisible";
    PortalTypeNames[PortalTypeNames["Visible"] = 2] = "Visible";
    PortalTypeNames[PortalTypeNames["Collision"] = 3] = "Collision";
    PortalTypeNames[PortalTypeNames["Changable"] = 4] = "Changable";
    PortalTypeNames[PortalTypeNames["Changable Invisible"] = 5] = "Changable Invisible";
    PortalTypeNames[PortalTypeNames["Town Portal"] = 6] = "Town Portal";
    PortalTypeNames[PortalTypeNames["Script"] = 7] = "Script";
    PortalTypeNames[PortalTypeNames["Script Invisible"] = 8] = "Script Invisible";
    PortalTypeNames[PortalTypeNames["Script Collision"] = 9] = "Script Collision";
    PortalTypeNames[PortalTypeNames["Hidden"] = 10] = "Hidden";
    PortalTypeNames[PortalTypeNames["Script Hidden"] = 11] = "Script Hidden";
    PortalTypeNames[PortalTypeNames["Vertical Spring"] = 12] = "Vertical Spring";
    PortalTypeNames[PortalTypeNames["Custom Impact Spring"] = 13] = "Custom Impact Spring";
    PortalTypeNames[PortalTypeNames["Unknown (PCIG)"] = 14] = "Unknown (PCIG)";
})(PortalTypeNames || (PortalTypeNames = {}));
;
var BackgroundTypeNames;
(function (BackgroundTypeNames) {
    BackgroundTypeNames[BackgroundTypeNames["Regular"] = 0] = "Regular";
    BackgroundTypeNames[BackgroundTypeNames["Horizontal Copies"] = 1] = "Horizontal Copies";
    BackgroundTypeNames[BackgroundTypeNames["Vertical Copies"] = 2] = "Vertical Copies";
    BackgroundTypeNames[BackgroundTypeNames["H+V Copies"] = 3] = "H+V Copies";
    BackgroundTypeNames[BackgroundTypeNames["Horizontal Moving+Copies"] = 4] = "Horizontal Moving+Copies";
    BackgroundTypeNames[BackgroundTypeNames["Vertical Moving+Copies"] = 5] = "Vertical Moving+Copies";
    BackgroundTypeNames[BackgroundTypeNames["H+V Copies, Horizontal Moving"] = 6] = "H+V Copies, Horizontal Moving";
    BackgroundTypeNames[BackgroundTypeNames["H+V Copies, Vertical Moving"] = 7] = "H+V Copies, Vertical Moving";
})(BackgroundTypeNames || (BackgroundTypeNames = {}));
;
var Foothold = (function () {
    function Foothold(Position, Size) {
        this.Position = Position;
        this.Size = Size;
    }
    Foothold.loadFootholds = function (current) {
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
    };
    Foothold.prototype.draw = function (ctx) {
        ctx.beginPath();
        if (this.isWall()) {
            ctx.moveTo(this.Position.x, this.Position.y);
            ctx.lineTo(this.Position.x + this.Size.width, this.Position.y + this.Size.height);
        }
        else
            ctx.rect(this.Position.x, this.Position.y, this.Size.width, this.Size.height);
    };
    Foothold.prototype.isWall = function () {
        return this.Size.height == 0 || this.Size.width == 0;
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
        this.image.onload = function () {
            instance.hasLoaded = true;
        };
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
        if (size == null)
            size = new Size(this.image.width, this.image.height);
        ctx.strokeStyle = 'rgba(0, 200, 0, 1)';
        ctx.strokeRect(pos.x, pos.y, size.width, size.height);
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
        this.Position = Vector.lerp(this.Position, targetPos, 0.04);
    };
    Camera.prototype.draw = function () {
        this.reset();
        game.ctx.translate(-this.Position.x, -this.Position.y);
        game.ctx.scale(this.Zoom, this.Zoom);
    };
    return Camera;
})();
var Player = (function () {
    function Player() {
    }
    Player.prototype.init = function () {
        this.Position = new Vector(500, 450);
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
        if (!map.loaded)
            return;
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
        game.ctx.fillStyle = 'black';
        game.ctx.fillText('x: ' + Math.round(this.Position.x) + ', y: ' + Math.round(this.Position.y), this.Position.x - 30, this.Position.y - 100);
        game.ctx.fillText('frame time: ' + game.frameTime, this.Position.x - 30, this.Position.y - 130);
    };
    return Player;
})();
var Portal = (function () {
    function Portal(position, name) {
        this.position = position;
        this.name = name;
    }
    Portal.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2, false);
        ctx.strokeStyle = 'pink';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fillText(this.name, this.position.x - 30, this.position.y - 30);
    };
    Portal.loadPortals = function (data) {
        var list = [];
        for (var key in data) {
            var portal = data[key];
            var pos = new Vector(portal.x, portal.y);
            list.push(new Portal(new Vector(pos.x, pos.y), portal.pn + ":" + portal.pt));
        }
        return list;
    };
    return Portal;
})();
var World = (function () {
    function World() {
        this.Footholds = [];
        this.portals = [];
        this.Backgrounds = [];
        this.Animations = [];
        this.Tiles = [];
        this.loaded = false;
    }
    World.prototype.init = function (id) {
        this.Id = id;
        this.BasePath = 'Map/Map/Map' + this.Id.substr(0, 1) + '/' + this.Id + '.img/';
        var instance = this;
        http.httpGetAsset(this.BasePath + 'properties.json', function (data) {
            instance.loadData(data);
        });
    };
    World.prototype.loadData = function (mapData) {
        this.Footholds = Foothold.loadFootholds(mapData.foothold);
        this.portals = Portal.loadPortals(mapData.portal);
        for (var key in mapData) {
            var layer = mapData[key];
            if (!layer.info || !layer.info.tS)
                continue;
            var spriteBaseNameProp = layer.info.tS;
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
                tile.Z = parseInt(tileKey);
                this.Tiles.push(tile);
            }
            this.Tiles.sort(function (a, b) { return a.Z - b.Z; });
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
            this.Animations.sort(function (a, b) { return a.Z - b.Z; });
        }
        this.loaded = true;
    };
    World.prototype.update = function () {
    };
    World.prototype.draw = function () {
        for (var i = 0; i < this.Backgrounds.length; i++)
            this.Backgrounds[i].draw(game.ctx);
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
        game.ctx.beginPath();
        for (var i = 0; i < this.portals.length; i++)
            this.portals[i].draw(game.ctx);
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
        this.totalGameTime = Date.now();
        this.lastGameTime = this.totalGameTime - 20;
        this.frameTime = 20;
    };
    Game.prototype.resize = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    Game.prototype.update = function () {
        http.update();
        this.lastGameTime = this.totalGameTime;
        this.totalGameTime = Date.now();
        this.frameTime = this.totalGameTime - this.lastGameTime;
        camera.update();
        map.update();
        player.update();
    };
    Game.prototype.draw = function () {
        camera.reset();
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
var http = new HttpManager();
game.init();
camera.init();
player.init();
map.init('100000200');
$(window).resize(function () {
    game.resize();
});
function gotAnimationFrame() {
    requestAnimationFrame(gotAnimationFrame);
    game.update();
    game.draw();
}
gotAnimationFrame();
angular.module('maplestory', []).controller('minimap', function ($scope) {
    $scope.map = {
        name: 'Henesys',
        minimap: {
            background: http.baseUrl + map.BasePath + 'minimap/canvas.png'
        }
    };
});

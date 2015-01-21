/// <reference path="main.ts" />
var KeyCodes;
(function (KeyCodes) {
    KeyCodes[KeyCodes["left"] = 37] = "left";
    KeyCodes[KeyCodes["right"] = 39] = "right";
    KeyCodes[KeyCodes["up"] = 38] = "up";
    KeyCodes[KeyCodes["down"] = 40] = "down";
    KeyCodes[KeyCodes["enter"] = 13] = "enter";
    KeyCodes[KeyCodes["space"] = 32] = "space";
})(KeyCodes || (KeyCodes = {}));
var Player = (function () {
    function Player() {
    }
    Player.prototype.init = function () {
        this.Position = new Vector(3000, 570);
        this.Velocity = new Vector(0, 0);
        this.Size = new Size(60, 80);
        this.image = new Texture('http://nxcache.nexon.net/spotlight/112/007kn-7e9ea6e9-e3c1-402e-803d-7df82ad5ac53.gif');
        this.hasJumped = true;
        var instance = this;
        window.onkeydown = function (e) { return instance.onKeyDown(e); };
        window.onkeyup = function (e) { return instance.onKeyUp(e); };
    };
    Player.prototype.moveToRandomPortal = function () {
        for (var i = 0; i < ms.map.portals.length; i++) {
            if (ms.map.portals[i].name == "" || true) {
                this.Position = ms.map.portals[i].position.clone();
                this.Position.y -= 10;
                break;
            }
        }
    };
    Player.prototype.moveToPortal = function (name) {
        var moved = false;
        for (var i = 0; i < ms.map.portals.length; i++) {
            if (ms.map.portals[i].name == name) {
                this.Position = ms.map.portals[i].position.clone();
                this.Position.y -= 10;
                moved = true;
                break;
            }
        }
        if (!moved)
            this.moveToRandomPortal();
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
            if (ms.map.loaded) {
                for (var i = 0; i < ms.map.portals.length; i++) {
                    if (ms.map.portals[i].canUse(ms.player)) {
                        if (ms.map.portals[i].toMapId == ms.map.Id) {
                            ms.player.moveToPortal(ms.map.portals[i].toPortal);
                        }
                        else {
                            ms.map.loadMap(ms.map.portals[i].toMapId, ms.map.portals[i].toPortal);
                        }
                        break;
                    }
                }
            }
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
        if (!ms.map.loaded)
            return;
        this.Velocity.y += 0.3;
        for (var i = 0; i < ms.map.Footholds.length; i++)
            ms.map.Footholds[i].playerTouches = false;
        for (var i = 0; i < ms.map.Footholds.length; i++) {
            if (ms.map.Footholds[i].isPointColliding(Vector.plus(this.Position, new Vector(-this.Size.width / 2, 0)), this.Velocity) || ms.map.Footholds[i].isPointColliding(Vector.plus(this.Position, new Vector(this.Size.width / 2, 0)), this.Velocity)) {
                ms.map.Footholds[i].playerTouches = true;
                this.Velocity.y = 0;
                this.Position.y = ms.map.Footholds[i].Position.y;
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
        this.image.draw(ms.game.ctx, new Vector(this.Position.x - this.Size.width / 2, this.Position.y - this.Size.height), this.Size);
        ms.game.ctx.beginPath();
        ms.game.ctx.strokeStyle = "black";
        ms.game.ctx.moveTo(this.Position.x - 5, this.Position.y);
        ms.game.ctx.lineTo(this.Position.x + 5, this.Position.y);
        ms.game.ctx.moveTo(this.Position.x, this.Position.y + 5);
        ms.game.ctx.lineTo(this.Position.x, this.Position.y - 5);
        ms.game.ctx.stroke();
        ms.game.ctx.fillStyle = 'black';
        ms.game.ctx.fillText('x: ' + Math.round(this.Position.x) + ', y: ' + Math.round(this.Position.y), this.Position.x - 30, this.Position.y - 100);
        ms.game.ctx.fillText('frame time: ' + ms.game.frameTime, this.Position.x - 30, this.Position.y - 130);
    };
    return Player;
})();

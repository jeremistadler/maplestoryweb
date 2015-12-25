var KeyCodes;
(function (KeyCodes) {
    KeyCodes[KeyCodes["left"] = 37] = "left";
    KeyCodes[KeyCodes["right"] = 39] = "right";
    KeyCodes[KeyCodes["up"] = 38] = "up";
    KeyCodes[KeyCodes["down"] = 40] = "down";
    KeyCodes[KeyCodes["enter"] = 13] = "enter";
    KeyCodes[KeyCodes["space"] = 32] = "space";
    KeyCodes[KeyCodes["s"] = 83] = "s";
    KeyCodes[KeyCodes["a"] = 65] = "a";
    KeyCodes[KeyCodes["d"] = 68] = "d";
    KeyCodes[KeyCodes["w"] = 87] = "w";
})(KeyCodes || (KeyCodes = {}));
var Player = (function () {
    function Player(ms) {
        this.ms = ms;
        this.isInAir = false;
        this.touchingFoothold = null;
    }
    Player.prototype.init = function () {
        var _this = this;
        this.Position = new Vector(3000, 570);
        this.Velocity = new Vector(0, 0);
        this.Size = new Size(10, 70);
        this.isInAir = true;
        this.animator = new CharacterAnimator(this.ms, 'Character/00002000.img', ['walk1', 'walk2', 'jump', 'stand1', 'stand2']);
        window.onkeydown = function (e) { return _this.onKeyDown(e); };
        window.onkeyup = function (e) { return _this.onKeyUp(e); };
        window.addEventListener('deviceorientation', function (e) { return _this.handleDeviceOrigentation(e); }, false);
    };
    Player.prototype.handleDeviceOrigentation = function (ev) {
        if (ev && typeof ev.gamma == 'number') {
            var clampAt = 30;
            var multiplyWith = 0.1;
            this.Velocity.x = Math.min(Math.max(ev.gamma, -clampAt), clampAt) * multiplyWith;
            if (this.Velocity.x < 0.5 && this.Velocity.x > -0.5)
                this.Velocity.x = 0;
        }
    };
    Player.prototype.moveToRandomPortal = function () {
        for (var i = 0; i < this.ms.map.portals.length; i++) {
            if (this.ms.map.portals[i].name == "" || true) {
                this.Position = this.ms.map.portals[i].position.clone();
                this.Position.y -= 10;
                break;
            }
        }
    };
    Player.prototype.moveToPortal = function (name) {
        var moved = false;
        for (var i = 0; i < this.ms.map.portals.length; i++) {
            if (this.ms.map.portals[i].name == name) {
                this.Position = this.ms.map.portals[i].position.clone();
                this.Position.y -= 10;
                moved = true;
                break;
            }
        }
        if (!moved)
            this.moveToRandomPortal();
    };
    Player.prototype.onKeyDown = function (e) {
        if (e.keyCode == KeyCodes.left || e.keyCode == KeyCodes.a)
            this.Velocity.x = -3;
        else if (e.keyCode == KeyCodes.right || e.keyCode == KeyCodes.d)
            this.Velocity.x = 3;
        if (e.keyCode == KeyCodes.down || e.keyCode == KeyCodes.s) {
            this.Position.y += 2;
            this.Velocity.y = 0;
            this.isInAir = true;
        }
        if (e.keyCode == KeyCodes.up || e.keyCode == KeyCodes.w) {
            for (var i = 0; this.ms.map.loaded && i < this.ms.map.portals.length; i++) {
                if (this.ms.map.portals[i].canUse(this.ms.player)) {
                    if (this.ms.map.portals[i].toMapId == this.ms.map.Id) {
                        this.ms.player.moveToPortal(this.ms.map.portals[i].toPortal);
                    }
                    else {
                        this.ms.map.loadMap(this.ms.map.portals[i].toMapId, this.ms.map.portals[i].toPortal);
                    }
                    break;
                }
            }
        }
        if (e.keyCode == KeyCodes.space) {
            if (this.isInAir == false) {
                this.Velocity.y -= 10;
                this.isInAir = true;
                this.ms.sound.playSound("Game.img/Jump");
            }
        }
    };
    Player.prototype.onKeyUp = function (e) {
        if ((e.keyCode == KeyCodes.left || e.keyCode == KeyCodes.a) && this.Velocity.x < 0)
            this.Velocity.x = 0;
        else if ((e.keyCode == KeyCodes.right || e.keyCode == KeyCodes.d) && this.Velocity.x > 0)
            this.Velocity.x = 0;
    };
    Player.prototype.update = function () {
        if (!this.ms.map.loaded)
            return;
        this.Velocity.y += 0.5;
        var nextX = this.Position.x + this.Velocity.x * this.ms.game.frameTime * 0.05;
        var nextY = this.Position.y + this.Velocity.y * this.ms.game.frameTime * 0.05;
        if (!this.isInAir || this.Velocity.y > 0) {
            for (var i = 0; i < this.ms.map.Footholds.length; i++) {
                var intersection = this.ms.map.Footholds[i].getIntersection(this.Position.x, this.Position.y - 1 - (nextY - this.Position.y) * 3, nextX, nextY + 1);
                if (!isNaN(intersection)) {
                    this.touchingFoothold = this.ms.map.Footholds[i];
                    this.Velocity.y = 0;
                    nextY = this.Position.y = intersection;
                    this.isInAir = false;
                }
            }
        }
        this.Position.x = nextX;
        this.Position.y = nextY;
        if (this.Position.y > 5000) {
            this.Position.y = -400;
            this.Velocity.y = 0;
        }
    };
    Player.prototype.draw = function () {
        if (this.isInAir || this.Velocity.y > 0)
            this.animator.draw(this.ms.game.ctx, this.Position.x, this.Position.y, this.Velocity.x > 0, 'jump', this.ms.game.frameTime);
        else if (this.Velocity.x != 0)
            this.animator.draw(this.ms.game.ctx, this.Position.x, this.Position.y, this.Velocity.x > 0, 'walk1', this.ms.game.frameTime * Math.abs(this.Velocity.x / 3));
        else
            this.animator.draw(this.ms.game.ctx, this.Position.x, this.Position.y, this.Velocity.x > 0, 'stand1', this.ms.game.frameTime);
        this.ms.game.ctx.beginPath();
        this.ms.game.ctx.strokeStyle = "black";
        this.ms.game.ctx.moveTo(this.Position.x - 5, this.Position.y);
        this.ms.game.ctx.lineTo(this.Position.x + 5, this.Position.y);
        this.ms.game.ctx.moveTo(this.Position.x, this.Position.y + 5);
        this.ms.game.ctx.lineTo(this.Position.x, this.Position.y - 5);
        this.ms.game.ctx.stroke();
        this.ms.game.ctx.fillStyle = 'black';
        this.ms.game.ctx.textAlign = 'center';
        this.ms.game.ctx.fillText('x: ' + Math.round(this.Position.x) + ', y: ' + Math.round(this.Position.y), this.Position.x, this.Position.y + 15);
    };
    return Player;
})();

/// <reference path="main.ts" />
var Camera = (function () {
    function Camera() {
        this.Zoom = 1;
    }
    Camera.prototype.init = function () {
        this.Position = new Vector(0, 0);
    };
    Camera.prototype.reset = function () {
        ms.game.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    Camera.prototype.moveToPlayer = function () {
        this.Position.x = Math.round(ms.player.Position.x + -ms.game.canvas.width / 2 - ms.player.Size.width / 2);
        this.Position.y = Math.round(ms.player.Position.y + -ms.game.canvas.height / 2 - ms.player.Size.height / 2);
    };
    Camera.prototype.update = function () {
        var targetX = Math.round(ms.player.Position.x + -(ms.game.canvas.width * this.Zoom) / 2 - ms.player.Size.width / 2);
        var targetY = Math.round(ms.player.Position.y + -(ms.game.canvas.height * this.Zoom) / 2 - ms.player.Size.height / 2);
        if (Math.abs(this.Position.x - targetX) < 0.7)
            this.Position.x = targetX;
        if (Math.abs(this.Position.y - targetY) < 0.7)
            this.Position.y = targetY;
        this.Position.x = MathHelper.lerp(this.Position.x, targetX, 0.04);
        this.Position.y = MathHelper.lerp(this.Position.y, targetY, 0.04);
        this.boundsLeft = this.Position.x;
        this.boundsRight = this.Position.x + ms.game.canvas.width;
        this.boundsTop = this.Position.y;
        this.boundsBottom = this.Position.y + ms.game.canvas.height;
        this.width = ms.game.canvas.width / this.Zoom;
        this.height = ms.game.canvas.height / this.Zoom;
        this.centerX = this.boundsLeft + (this.boundsRight - this.boundsLeft) * 0.5;
        this.centerY = this.boundsTop + (this.boundsBottom - this.boundsTop) * 0.5;
    };
    Camera.prototype.draw = function () {
        this.reset();
        ms.game.ctx.translate(-this.Position.x, -this.Position.y);
        ms.game.ctx.scale(this.Zoom, this.Zoom);
    };
    return Camera;
})();

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
        var targetPos = new Vector(0, 0);
        targetPos.x = Math.round(ms.player.Position.x + -ms.game.canvas.width / 2 - ms.player.Size.width / 2);
        targetPos.y = Math.round(ms.player.Position.y + -ms.game.canvas.height / 2 - ms.player.Size.height / 2);
        if (Math.abs(this.Position.x - targetPos.x) < 0.7)
            this.Position.x = targetPos.x;
        if (Math.abs(this.Position.y - targetPos.y) < 0.7)
            this.Position.y = targetPos.y;
        this.Position = Vector.lerp(this.Position, targetPos, 0.04);
    };
    Camera.prototype.draw = function () {
        this.reset();
        ms.game.ctx.translate(-this.Position.x, -this.Position.y);
        ms.game.ctx.scale(this.Zoom, this.Zoom);
    };
    return Camera;
})();

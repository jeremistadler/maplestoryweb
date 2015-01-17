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

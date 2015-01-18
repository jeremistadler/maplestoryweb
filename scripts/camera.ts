/// <reference path="main.ts" />

class Camera {
    Position: Vector;
    Zoom: number = 1;

    init() {
        this.Position = new Vector(0, 0);
    }

    reset() {
        game.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    update() {
        var targetPos = new Vector(0, 0);
        targetPos.x = Math.round(player.Position.x + -game.canvas.width / 2 - player.Size.width / 2);
        targetPos.y = Math.round(player.Position.y + -game.canvas.height / 2 - player.Size.height / 2);

        if (Math.abs(this.Position.x - targetPos.x) < 0.7)
            this.Position.x = targetPos.x;

        if (Math.abs(this.Position.y - targetPos.y) < 0.7)
            this.Position.y = targetPos.y;

        this.Position = Vector.lerp(this.Position, targetPos, 0.04);
    }
    draw() {
        this.reset();
        game.ctx.translate(-this.Position.x, -this.Position.y);
        game.ctx.scale(this.Zoom, this.Zoom);
    }
}
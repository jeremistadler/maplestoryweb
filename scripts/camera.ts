/// <reference path="main.ts" />

class Camera {
    Position: Vector;
    Zoom: number = 1;

    boundsLeft: number;
    boundsRight: number;
    boundsTop: number;
    boundsBottom: number;

    init() {
        this.Position = new Vector(0, 0);
    }

    reset() {
        ms.game.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    moveToPlayer() {
        this.Position.x = Math.round(ms.player.Position.x + -ms.game.canvas.width / 2 - ms.player.Size.width / 2);
        this.Position.y = Math.round(ms.player.Position.y + -ms.game.canvas.height / 2 - ms.player.Size.height / 2);
    }

    update() {
        var targetX = Math.round(ms.player.Position.x + -ms.game.canvas.width / 2 - ms.player.Size.width / 2);
        var targetY = Math.round(ms.player.Position.y + -ms.game.canvas.height / 2 - ms.player.Size.height / 2);

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
    }

    draw() {
        this.reset();
        ms.game.ctx.translate(-this.Position.x, -this.Position.y);
        ms.game.ctx.scale(this.Zoom, this.Zoom);
    }
}
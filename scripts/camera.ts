class Camera {
    Position: Vector;
    Zoom: number = 1 / (window.devicePixelRatio || 1);

    boundsLeft: number;
    boundsRight: number;
    boundsTop: number;
    boundsBottom: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    targetX: number;
    targetY: number;

    constructor(private ms: IEngine) {}

    init() {
        this.Position = new Vector(0, 0);
    }

    reset() {
        this.ms.game.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    moveToPlayer() {
        this.Position.x = Math.round(this.ms.player.Position.x + -this.width / 2 - this.ms.player.Size.width / 2);
        this.Position.y = Math.round(this.ms.player.Position.y + -this.height / 2 - this.ms.player.Size.height / 2);
    }

    update() {
        this.width = this.ms.game.canvas.width / this.Zoom;
        this.height = this.ms.game.canvas.height / this.Zoom;

        this.targetX = Math.round(this.ms.player.Position.x + -this.width / 2 - this.ms.player.Size.width / 2);
        this.targetY = Math.round(this.ms.player.Position.y + -this.height / 2 - this.ms.player.Size.height / 2);

        if (Math.abs(this.Position.x - this.targetX) < 0.7)
            this.Position.x = this.targetX;

        if (Math.abs(this.Position.y - this.targetY) < 0.7)
            this.Position.y = this.targetY;

        this.Position.x = MathHelper.lerp(this.Position.x, this.targetX, 0.04);
        this.Position.y = MathHelper.lerp(this.Position.y, this.targetY, 0.04);


        this.boundsLeft = this.Position.x;
        this.boundsRight = this.Position.x + this.width;
        this.boundsTop = this.Position.y;
        this.boundsBottom = this.Position.y + this.height;

        this.centerX = this.boundsLeft + (this.boundsRight - this.boundsLeft) * 0.5;
        this.centerY = this.boundsTop + (this.boundsBottom - this.boundsTop) * 0.5;
    }

    draw() {
        this.reset();
        this.ms.game.ctx.translate(Math.round(-this.Position.x * this.Zoom * 2) / 2, Math.round(-this.Position.y * this.Zoom * 2) / 2);
        this.ms.game.ctx.scale(this.Zoom, this.Zoom);
    }
}

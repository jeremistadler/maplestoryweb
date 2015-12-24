
enum KeyCodes {
    left = 37,
    right = 39,
    up = 38,
    down = 40,
    enter = 13,
    space = 32,
    s = 83,
    a = 65,
    d = 68,
    w = 87
}


class Player {
    Position: Vector;
    Velocity: Vector;
    Size: Size;
    hasJumped: boolean;
    animator: CharacterAnimator;

    constructor(private ms: IEngine){}

    init() {
        this.Position = new Vector(3000, 570);
        this.Velocity = new Vector(0, 0);
        this.Size = new Size(10, 70);
        this.hasJumped = true;

        var instance = this;
        window.onkeydown = (e) => instance.onKeyDown(e);
        window.onkeyup = (e) => instance.onKeyUp(e);

        this.animator = new CharacterAnimator(this.ms, 'Character/00002000.img', ['walk1', 'walk2', 'jump', 'stand1', 'stand2']);

    }

    moveToRandomPortal() {
        for (var i = 0; i < this.ms.map.portals.length; i++) {
            if (this.ms.map.portals[i].name == "" || true) {
                this.Position = this.ms.map.portals[i].position.clone();
                this.Position.y -= 10;
                break;
            }
        }
    }

    moveToPortal(name) {
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
    }

    onKeyDown(e: KeyboardEvent) {
        if (e.keyCode == KeyCodes.left || e.keyCode == KeyCodes.a)
            this.Velocity.x = -3;
        else if (e.keyCode == KeyCodes.right || e.keyCode == KeyCodes.d)
            this.Velocity.x = 3;

        if (e.keyCode == KeyCodes.down || e.keyCode == KeyCodes.s) { this.Position.y++; this.Velocity.y++; }
        if (e.keyCode == KeyCodes.up || e.keyCode == KeyCodes.w) {
            if (this.ms.map.loaded) {
                for (var i = 0; i < this.ms.map.portals.length; i++) {
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
        }
        if (e.keyCode == KeyCodes.space) {
            if (this.hasJumped == false) {
                this.Velocity.y -= 10;
                this.hasJumped = true;
                this.ms.sound.playSound("Game.img/Jump");
            }
        }
    }

    onKeyUp(e: KeyboardEvent) {
        if ((e.keyCode == KeyCodes.left || e.keyCode == KeyCodes.a) && this.Velocity.x < 0) // left
            this.Velocity.x = 0;
        else if ((e.keyCode == KeyCodes.right || e.keyCode == KeyCodes.d) && this.Velocity.x > 0) // right
            this.Velocity.x = 0;
    }



    update() {
        if (!this.ms.map.loaded) return;

        this.Velocity.y += 0.5;

        for (var i = 0; i < this.ms.map.Footholds.length; i++)
            this.ms.map.Footholds[i].playerTouches = false;

        var nextX = this.Position.x + this.Velocity.x * this.ms.game.frameTime * 0.05;
        var nextY = this.Position.y + this.Velocity.y * this.ms.game.frameTime * 0.05;


        for (var i = 0; i < this.ms.map.Footholds.length; i++) {
            if (this.ms.map.Footholds[i].isPointColliding(this.Position.x - this.Size.width / 2, this.Position.y, nextX, nextY) ||
                this.ms.map.Footholds[i].isPointColliding(this.Position.x + this.Size.width / 2, this.Position.y, nextX, nextY)) {
                this.ms.map.Footholds[i].playerTouches = true;
                this.Velocity.y = 0;
                nextY = this.Position.y = this.ms.map.Footholds[i].Position.y;
                this.hasJumped = false;
            }
        }

        this.Position.x = nextX;
        this.Position.y = nextY;

        if (this.Position.y > 5000) {
            this.Position.y = -400;
            this.Velocity.y = 0;
        }
    }

    draw() {
        if (this.hasJumped || this.Velocity.y > 0)
            this.animator.draw(this.ms.game.ctx, this.Position.x, this.Position.y, this.Velocity.x > 0, 'jump');
        else if (this.Velocity.x != 0)
            this.animator.draw(this.ms.game.ctx, this.Position.x, this.Position.y, this.Velocity.x > 0, 'walk1');
        else
            this.animator.draw(this.ms.game.ctx, this.Position.x, this.Position.y, this.Velocity.x > 0, 'stand1');

        this.ms.game.ctx.beginPath();
        this.ms.game.ctx.strokeStyle = "black";
        this.ms.game.ctx.moveTo(this.Position.x - 5, this.Position.y);
        this.ms.game.ctx.lineTo(this.Position.x + 5, this.Position.y);
        this.ms.game.ctx.moveTo(this.Position.x, this.Position.y + 5);
        this.ms.game.ctx.lineTo(this.Position.x, this.Position.y - 5);
        this.ms.game.ctx.stroke();

        //ms.game.ctx.fillStyle = 'black';
        //ms.game.ctx.fillText('x: ' + Math.round(this.Position.x) + ', y: ' + Math.round(this.Position.y), this.Position.x - 30, this.Position.y - 100);
    }
}

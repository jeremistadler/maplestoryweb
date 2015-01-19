/// <reference path="main.ts" />

class Foothold {
    playerTouches: boolean;
    id: number;

    constructor(public Position: Vector, public Size: Size) { }

    static loadFootholds(current): Foothold[] {
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
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        if (this.isWall()) {
            ctx.moveTo(this.Position.x, this.Position.y);
            ctx.lineTo(this.Position.x + this.Size.width, this.Position.y + this.Size.height);
        }
        else
            ctx.rect(this.Position.x, this.Position.y, this.Size.width, this.Size.height);
    }

    isWall() {
        return this.Size.height == 0 || this.Size.width == 0;
    }

    isPointColliding(point: Vector, velocity: Vector): boolean {
        return (
            this.Position.x <= point.x &&
            this.Position.x + this.Size.width >= point.x &&
            this.Position.y >= point.y &&
            this.Position.y <= point.y + velocity.y &&
            true);
    }
}
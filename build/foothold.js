var Foothold = (function () {
    function Foothold(Position, Size) {
        this.Position = Position;
        this.Size = Size;
    }
    Foothold.loadFootholds = function (current) {
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
    };
    Foothold.prototype.draw = function (ctx) {
        ctx.beginPath();
        if (this.isWall()) {
            ctx.moveTo(this.Position.x, this.Position.y);
            ctx.lineTo(this.Position.x + this.Size.width, this.Position.y + this.Size.height);
        }
        else
            ctx.rect(this.Position.x, this.Position.y, this.Size.width, this.Size.height);
    };
    Foothold.prototype.isWall = function () {
        return this.Size.height == 0 || this.Size.width == 0;
    };
    Foothold.prototype.isPointColliding = function (point, velocity) {
        return (this.Position.x <= point.x && this.Position.x + this.Size.width >= point.x && this.Position.y >= point.y && this.Position.y <= point.y + velocity.y && true);
    };
    return Foothold;
})();

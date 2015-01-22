/// <reference path="main.ts" />
var Foothold = (function () {
    function Foothold(Position, Size) {
        this.Position = Position;
        this.Size = Size;
    }
    Foothold.loadFootholds = function (current) {
        var list = [];
        if (current.x1) {
            var minX = Math.min(current.x1, current.x2);
            var minY = Math.min(current.y1, current.y2);
            var maxX = Math.max(current.x1, current.x2);
            var maxY = Math.max(current.y1, current.y2);
            list.push(new Foothold(new Vector(minX, minY), new Size(maxX - minX, maxY - minY)));
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
    Foothold.prototype.isPointColliding = function (pointX, pointY, nextPosX, nextPosY) {
        return (this.Position.x <= pointX && this.Position.x + this.Size.width >= pointX && this.Position.y >= pointY && this.Position.y <= nextPosY);
    };
    return Foothold;
})();

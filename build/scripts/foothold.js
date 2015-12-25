var Foothold = (function () {
    function Foothold(id, nextId, prevId, pieceId, rect) {
        this.id = id;
        this.nextId = nextId;
        this.prevId = prevId;
        this.pieceId = pieceId;
        this.rect = rect;
        this.centerX = rect.x1 + (rect.x2 - rect.x1) * 0.5;
        this.centerY = rect.y1 + (rect.y2 - rect.y1) * 0.5;
    }
    Foothold.loadFootholds = function (current, id) {
        var list = [];
        if (current.x1) {
            var minX = Math.min(current.x1, current.x2);
            var minY = Math.min(current.y1, current.y2);
            var maxX = Math.max(current.x1, current.x2);
            var maxY = Math.max(current.y1, current.y2);
            var rect = new Rectangle(minX, minY, maxX, maxY);
            list.push(new Foothold(id, current.next, current.prev, current.piece, rect));
        }
        else {
            for (var key in current) {
                var addedFootholds = Foothold.loadFootholds(current[key], parseInt(key));
                Foothold.linkFootholds(addedFootholds);
                list = list.concat(addedFootholds);
            }
        }
        return list;
    };
    Foothold.linkFootholds = function (footholds) {
        var lookup = {};
        footholds.forEach(function (f) { return lookup[f.id] = f; });
        footholds.forEach(function (f) { return f.next = lookup[f.nextId]; });
        footholds.forEach(function (f) { return f.prev = lookup[f.prevId]; });
        footholds.forEach(function (f) {
            if (f.next && f.prev) {
                var y1 = f.prev.centerY > f.centerY ? Math.max(f.rect.y2, f.prev.rect.y1) : Math.max(f.rect.y1, f.prev.rect.y2);
                var y2 = f.next.centerY > f.centerY ? Math.max(f.rect.y2, f.next.rect.y1) : Math.max(f.rect.y1, f.next.rect.y2);
                f.line = new Line(f.rect.x1, y1, f.rect.x2, y2);
            }
            else if (f.prev) {
                var y = f.prev.centerY > f.centerY ? Math.max(f.rect.y2, f.prev.rect.y1) : Math.max(f.rect.y1, f.prev.rect.y2);
                f.line = new Line(f.rect.x1, y, f.rect.x2, f.rect.y2);
            }
            else if (f.next) {
                var y = f.next.centerY > f.centerY ? Math.max(f.rect.y2, f.next.rect.y1) : Math.max(f.rect.y1, f.next.rect.y2);
                f.line = new Line(f.rect.x1, f.rect.y2, f.rect.x2, y);
            }
            else
                f.line = new Line(f.rect.x1, f.rect.y1, f.rect.x2, f.rect.y2);
        });
    };
    Foothold.prototype.draw = function (ctx, isPlayerTouching) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = 'hsla(' + (this.pieceId * 72) % 360 + ', 50%, 50%, 0.5)';
        //ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.strokeStyle = isPlayerTouching ? 'rgba(200, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)';
        if (this.isWall()) {
            ctx.moveTo(this.rect.x1, this.rect.y1);
            ctx.lineTo(this.rect.x2, this.rect.y2);
        }
        else
            ctx.rect(this.rect.x1, this.rect.y1, this.rect.x2 - this.rect.x1, this.rect.y2 - this.rect.y1);
        ctx.fill();
        ctx.strokeStyle = isPlayerTouching ? 'rgba(150, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.moveTo(this.line.x1, this.line.y1);
        ctx.lineTo(this.line.x2, this.line.y2);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(this.id.toString(), this.centerX, this.rect.y2 + 15);
    };
    Foothold.prototype.isWall = function () {
        return this.rect.x1 == this.rect.x2 || this.rect.y1 == this.rect.y2;
    };
    Foothold.prototype.getIntersection = function (pointX, pointY, nextPosX, nextPosY) {
        return Foothold.getLineYIntersection(pointX, pointY, nextPosX, nextPosY, this.line.x1, this.line.y1, this.line.x2, this.line.y2);
    };
    Foothold.getLineYIntersection = function (p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
        var s1_x = p1_x - p0_x;
        var s1_y = p1_y - p0_y;
        var s2_x = p3_x - p2_x;
        var s2_y = p3_y - p2_y;
        var s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        var t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
        if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
            return p0_y + (t * s1_y);
        return NaN;
    };
    return Foothold;
})();

var Rectangle = (function () {
    function Rectangle(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    return Rectangle;
})();
var Line = (function () {
    function Line(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    return Line;
})();
var Size = (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    Size.zero = function () { return new Size(0, 0); };
    return Size;
})();
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.times = function (k, v) { return new Vector(k * v.x, k * v.y); };
    Vector.min = function (v1, v2) { return new Vector(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y)); };
    Vector.max = function (v1, v2) { return new Vector(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y)); };
    Vector.minus = function (v1, v2) { return new Vector(v1.x - v2.x, v1.y - v2.y); };
    Vector.plus = function (v1, v2) { return new Vector(v1.x + v2.x, v1.y + v2.y); };
    Vector.plusSize = function (v1, v2) { return new Vector(v1.x + v2.width, v1.y + v2.height); };
    Vector.dot = function (v1, v2) { return v1.x * v2.x + v1.y * v2.y; };
    Vector.distanceSquared = function (v1, v2) { return (v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y); };
    Vector.distance = function (v1, v2) { return Math.sqrt(Vector.distanceSquared(v1, v2)); };
    Vector.mag = function (v) { return Math.sqrt(v.x * v.x + v.y * v.y); };
    Vector.lerp = function (v0, v1, t) { return new Vector(v0.x + t * (v1.x - v0.x), v0.y + t * (v1.y - v0.y)); };
    Vector.prototype.clone = function () { return new Vector(this.x, this.y); };
    Vector.norm = function (v) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    };
    Vector.Zero = function () { return new Vector(0, 0); };
    return Vector;
})();

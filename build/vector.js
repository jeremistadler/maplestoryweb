var Size = (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Size, "zero", {
        get: function () {
            return new Size(0, 0);
        },
        enumerable: true,
        configurable: true
    });
    return Size;
})();
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.times = function (k, v) {
        return new Vector(k * v.x, k * v.y);
    };
    Vector.min = function (v1, v2) {
        return new Vector(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y));
    };
    Vector.max = function (v1, v2) {
        return new Vector(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y));
    };
    Vector.minus = function (v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    };
    Vector.plus = function (v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    };
    Vector.plusSize = function (v1, v2) {
        return new Vector(v1.x + v2.width, v1.y + v2.height);
    };
    Vector.dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    };
    Vector.mag = function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    };
    Vector.lerp = function (v0, v1, t) {
        return new Vector(v0.x + t * (v1.x - v0.x), v0.y + t * (v1.y - v0.y));
    };
    Vector.norm = function (v) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    };
    Object.defineProperty(Vector, "Zero", {
        get: function () {
            return new Vector(0, 0);
        },
        enumerable: true,
        configurable: true
    });
    return Vector;
})();

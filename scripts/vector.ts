/// <reference path="main.ts" />

class Size {
    constructor(public width: number, public height: number) { }

    static get zero(): Size {
        return new Size(0, 0);
    }
}

class Vector {
    constructor(public x: number, public y: number) { }
    static times(k: number, v: Vector) { return new Vector(k * v.x, k * v.y); }
    static min(v1: Vector, v2: Vector) { return new Vector(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y)); }
    static max(v1: Vector, v2: Vector) { return new Vector(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y)); }
    static minus(v1: Vector, v2: Vector) { return new Vector(v1.x - v2.x, v1.y - v2.y); }
    static plus(v1: Vector, v2: Vector) { return new Vector(v1.x + v2.x, v1.y + v2.y); }
    static plusSize(v1: Vector, v2: Size) { return new Vector(v1.x + v2.width, v1.y + v2.height); }
    static dot(v1: Vector, v2: Vector) { return v1.x * v2.x + v1.y * v2.y; }
    static distanceSquared(v1: Vector, v2: Vector) { return (v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y); }
    static distance(v1: Vector, v2: Vector) { return Math.sqrt(Vector.distanceSquared(v1, v2)); }
    static mag(v: Vector) { return Math.sqrt(v.x * v.x + v.y * v.y); }
    static lerp(v0: Vector, v1: Vector, t: number) { return new Vector(v0.x + t * (v1.x - v0.x), v0.y + t * (v1.y - v0.y)); }
    clone() { return new Vector(this.x, this.y) }
    static norm(v: Vector) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    }
    static get Zero(): Vector {
        return new Vector(0, 0);
    }
}
/// <reference path="main.ts" />

class MathHelper {
    static lerp(v0: number, v1: number, t: number): number {
        return v0 + t * (v1 - v0);
    }
}
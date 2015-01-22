/// <reference path="main.ts" />
var MathHelper = (function () {
    function MathHelper() {
    }
    MathHelper.lerp = function (v0, v1, t) {
        return v0 + t * (v1 - v0);
    };
    return MathHelper;
})();

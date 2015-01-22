/// <reference path="main.ts" />
var Fps = (function () {
    function Fps() {
        this.index = 0;
        this.data = new Array(100);
        for (var i = 0; i < 100; i++) {
            this.data[i] = 0;
        }
    }
    Fps.prototype.draw = function (ctx) {
        this.index++;
        if (this.index == 99)
            this.index = 0;
        this.data[this.index] = ms.game.frameTime;
        ctx.beginPath();
        ctx.fillStyle = 'rgb(50, 200, 50)';
        for (var i = 0; i < 100; i++)
            ctx.rect(i * 2, 0, 2, this.data[i]);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'rgb(200, 50, 50)';
        for (var i = 0; i < 100; i++)
            if (this.data[i] > 25)
                ctx.rect(i * 2, 0, 2, this.data[i]);
        ctx.fill();
    };
    return Fps;
})();

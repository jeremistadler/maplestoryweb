var Fps = (function () {
    function Fps(ms) {
        this.ms = ms;
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
        this.data[this.index] = this.ms.game.frameTime;
        var x = 500;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        ctx.fillStyle = 'rgb(50, 200, 50)';
        for (var i = 0; i < 100; i++)
            ctx.rect(x + i * 2, 0, 2, this.data[i]);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'rgb(200, 50, 50)';
        for (var i = 0; i < 100; i++)
            if (this.data[i] > 25)
                ctx.rect(x + i * 2, 0, 2, this.data[i]);
        ctx.fill();
    };
    return Fps;
})();

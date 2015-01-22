/// <reference path="main.ts" />


class Fps {
    index: number = 0;
    data: number[] = new Array(100);

    constructor() {
        for (var i = 0; i < 100; i++) {
            this.data[i] = 0;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
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
    }
}


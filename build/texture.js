/// <reference path="main.ts" />
var Texture = (function () {
    function Texture(path) {
        this.image = new Image();
        this.image.src = path;
        var instance = this;
        this.image.onload = function () {
            instance.hasLoaded = true;
        };
        this.image.onerror = function () { return instance.hasError = true; };
    }
    Texture.prototype.draw = function (ctx, posX, posY, flip) {
        if (this.hasError) {
            ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
            ctx.fillRect(posX, posY, 100, 100);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillText('error...', posX + 10, posY + 10);
            return;
        }
        if (!this.hasLoaded) {
            ctx.fillStyle = 'rgba(0, 0, 200, 0.2)';
            ctx.fillRect(posX, posY, 100, 100);
            ctx.fillStyle = 'white';
            ctx.fillText('loading...', posX, posY);
            return;
        }
        //if (posX + this.image.width < ms.camera.boundsLeft || 
        //    posX > ms.camera.boundsRight ||
        //    posY > ms.camera.boundsBottom ||
        //    posY + this.image.height < ms.camera.boundsTop
        //    ) return;
        if (flip) {
            //ctx.save();
            //ctx.translate(-(posX), 0);
            //ctx.scale(-1, 1);
            //ctx.translate(posX, 0);
            ctx.drawImage(this.image, posX, posY, this.image.width, this.image.height);
        }
        else {
            ctx.drawImage(this.image, posX, posY, this.image.width, this.image.height);
        }
    };
    Texture.prototype.drawWithSize = function (ctx, posX, posY, width, height, flip) {
        if (this.hasError) {
            ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
            ctx.fillRect(posX, posY, width, height);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillText('error...', posX + 10, posY + 10);
            return;
        }
        if (!this.hasLoaded) {
            ctx.fillStyle = 'rgba(0, 0, 200, 0.2)';
            ctx.fillRect(posX, posY, width, height);
            ctx.fillStyle = 'white';
            ctx.fillText('loading...', posX, posY);
            return;
        }
        ctx.drawImage(this.image, posX, posY, width, height);
    };
    return Texture;
})();

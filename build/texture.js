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
    Texture.prototype.draw = function (ctx, pos, size) {
        if (this.hasError) {
            size = size || new Size(100, 100);
            ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
            ctx.fillRect(pos.x, pos.y, size.width, size.height);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillText('error...', pos.x + 10, pos.y + 10);
            return;
        }
        if (!this.hasLoaded) {
            size = size || new Size(100, 100);
            ctx.fillStyle = 'rgba(0, 0, 200, 0.2)';
            ctx.fillRect(pos.x, pos.y, size.width, size.height);
            ctx.fillStyle = 'white';
            ctx.fillText('loading...', pos.x, pos.y);
            return;
        }
        if (size == null)
            ctx.drawImage(this.image, pos.x, pos.y, this.image.width, this.image.height);
        else
            ctx.drawImage(this.image, pos.x, pos.y, size.width, size.height);
        //if (size == null)
        //	size = new Size(this.image.width, this.image.height);
        //ctx.strokeStyle = 'rgba(0, 200, 0, 1)';
        //ctx.strokeRect(pos.x, pos.y, size.width, size.height);
    };
    return Texture;
})();

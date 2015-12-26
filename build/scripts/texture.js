var Texture = (function () {
    function Texture(ms, path) {
        this.ms = ms;
        this.image = new Image();
        this.image.src = path;
        var instance = this;
        this.image.onload = function () { instance.hasLoaded = true; };
        this.image.onerror = function () { return instance.hasError = true; };
    }
    Texture.prototype.drawTiled = function (ctx, posX, posY, tilingDistanceX, tilingDistanceY, tileX, tileY) {
        if (!this.hasLoaded)
            return;
        if (tilingDistanceX == 0)
            tilingDistanceX = this.image.width;
        if (tilingDistanceY == 0)
            tilingDistanceY = this.image.height;
        if (tilingDistanceX < 0)
            tilingDistanceX = -tilingDistanceX;
        if (tilingDistanceY < 0)
            tilingDistanceY = -tilingDistanceY;
        var xbegin = posX;
        var xend = posX;
        var ybegin = posY;
        var yend = posY;
        if (tileX) {
            while (xbegin > this.ms.camera.Position.x)
                xbegin -= tilingDistanceX;
            while (xend < this.ms.camera.boundsRight)
                xend += tilingDistanceX;
        }
        if (tileY) {
            ybegin += this.image.height;
            ybegin %= tilingDistanceY;
            if (ybegin <= 0)
                ybegin += tilingDistanceY;
            ybegin -= this.image.height;
            yend -= this.ms.camera.height;
            yend %= tilingDistanceY;
            if (yend >= 0)
                yend -= tilingDistanceY;
            yend += this.ms.camera.height;
            if (yend < ybegin)
                return;
        }
        //if (xend + this.image.width < 0) return;
        //if (xbegin > this.ms.camera.width) return;
        //if (yend + this.image.height < 0) return;
        //if (ybegin > this.ms.camera.height) return;
        for (var x = xbegin; x <= xend; x += tilingDistanceX) {
            for (var y = ybegin; y <= yend; y += tilingDistanceY) {
                ctx.drawImage(this.image, x, y);
            }
        }
    };
    Texture.prototype.createFlippedImage = function () {
        this.flippedImage = document.createElement('canvas');
        this.flippedImage.width = this.image.width;
        this.flippedImage.height = this.image.height;
        var ctx = this.flippedImage.getContext('2d');
        ctx.scale(-1, 1);
        ctx.translate(-this.flippedImage.width, 0);
        ctx.drawImage(this.image, 0, 0);
    };
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
        //if (posX + this.image.width < this.ms.camera.boundsLeft ||
        //    posX > this.ms.camera.boundsRight ||
        //    posY > this.ms.camera.boundsBottom ||
        //    posY + this.image.height < this.ms.camera.boundsTop
        //    ) return;
        if (flip) {
            if (!this.flippedImage)
                this.createFlippedImage();
            ctx.drawImage(this.flippedImage, posX, posY, this.image.width, this.image.height);
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

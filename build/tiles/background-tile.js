/// <reference path="../main.ts" />
var BackgroundType;
(function (BackgroundType) {
    BackgroundType[BackgroundType["Regular"] = 0] = "Regular";
    BackgroundType[BackgroundType["HorizontalCopies"] = 1] = "HorizontalCopies";
    BackgroundType[BackgroundType["VerticalCopies"] = 2] = "VerticalCopies";
    BackgroundType[BackgroundType["HVCopies"] = 3] = "HVCopies";
    BackgroundType[BackgroundType["HorizontalMovingCopies"] = 4] = "HorizontalMovingCopies";
    BackgroundType[BackgroundType["VerticalMovingCopies"] = 5] = "VerticalMovingCopies";
    BackgroundType[BackgroundType["HVCopiesHorizontalMoving"] = 6] = "HVCopiesHorizontalMoving";
    BackgroundType[BackgroundType["HVCopiesVerticalMoving"] = 7] = "HVCopiesVerticalMoving";
})(BackgroundType || (BackgroundType = {}));
var BackgroundTile = (function () {
    function BackgroundTile() {
    }
    BackgroundTile.LoadBackground = function (item) {
        var bg = new BackgroundTile();
        bg.Tex = new Texture(ms.http.baseUrl + 'Map/Back/' + item.bS + '.img/back/' + item.no + '.png');
        bg.position = new Vector(item.x, item.y);
        bg.origin = new Vector(0, 0);
        bg.C = new Vector(item.cx || 0, item.cy || 0);
        bg.R = new Vector(item.rx || 0, item.ry || 0);
        bg.Type = item.type;
        bg.flip = item.flip > 0;
        return bg;
    };
    BackgroundTile.prototype.drawHorizontalCopies = function (ctx, x, y, cx) {
        var width = this.Tex.image.width;
        this.Tex.draw(ctx, x, y, this.flip);
        var copyX = x - cx;
        while (copyX + width > 0) {
            this.Tex.draw(ctx, copyX, y, this.flip);
            copyX -= cx;
        }
        copyX = x + cx;
        while (copyX < ms.camera.width) {
            this.Tex.draw(ctx, copyX, y, this.flip);
            copyX += cx;
        }
    };
    BackgroundTile.prototype.draw = function (ctx) {
        if (!this.Tex.hasLoaded)
            return;
        var x = this.position.x + this.R.x * -ms.camera.centerX * 0.01;
        var y = this.position.y + 300 + ((this.R.y * (-ms.camera.centerY + 300)) / 100);
        var cx = this.C.x || this.Tex.image.width;
        var cy = this.C.y || this.Tex.image.height;
        switch (this.Type) {
            case 0 /* Regular */:
                this.Tex.draw(ctx, x, y, this.flip);
                break;
            case 1 /* HorizontalCopies */:
                this.drawHorizontalCopies(ctx, x, y, cy);
            case 2 /* VerticalCopies */:
                break;
        }
    };
    return BackgroundTile;
})();

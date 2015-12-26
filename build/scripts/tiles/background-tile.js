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
    function BackgroundTile(ms) {
        this.ms = ms;
    }
    BackgroundTile.LoadBackground = function (ms, item, z) {
        var bg = new BackgroundTile(ms);
        // Todo, if item.ani == true then use Map/Ani/ instead of Map/Back/
        bg.Tex = new Texture(ms, ms.http.baseUrl + 'Map/Back/' + item.bS + '.img/back/' + item.no + '.png');
        bg.position = new Vector(item.x, item.y);
        bg.origin = new Vector(0, 0);
        bg.C = new Vector(item.cx || 0, item.cy || 0);
        bg.R = new Vector(item.rx || 0, item.ry || 0);
        bg.Type = item.type;
        bg.flip = item.flip > 0;
        bg.z = z;
        // Todo, if item.front then add to foreground layer
        return bg;
    };
    BackgroundTile.prototype.draw = function (ctx) {
        if (!this.Tex.hasLoaded)
            return;
        var x = this.position.x; //+ this.R.x * -this.ms.camera.centerX * 0.01;
        var y = this.position.y; // + 300 + ((this.R.y * (-this.ms.camera.centerY + 300)) / 100);
        switch (this.Type) {
            case BackgroundType.Regular:
                for (var x_1 = this.R.x; x_1 < 30000; x_1 += this.position.x) {
                    this.Tex.draw(ctx, x_1, y, this.flip);
                }
                break;
            case BackgroundType.HorizontalCopies:
                this.ms.game.ctx.setTransform(1, 0, 0, 1, 0, 0);
                this.Tex.drawTiled(ctx, x, y, this.C.x, this.C.y, true, false);
                this.ms.camera.draw();
                break;
            case BackgroundType.HorizontalMovingCopies:
                x += this.R.x * 0.004;
                this.Tex.drawTiled(ctx, x, y, this.C.x, this.C.y, true, false);
                break;
        }
    };
    return BackgroundTile;
})();

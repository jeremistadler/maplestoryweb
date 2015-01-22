/// <reference path="../main.ts" />
var BackgroundTypeNames;
(function (BackgroundTypeNames) {
    BackgroundTypeNames[BackgroundTypeNames["Regular"] = 0] = "Regular";
    BackgroundTypeNames[BackgroundTypeNames["Horizontal Copies"] = 1] = "Horizontal Copies";
    BackgroundTypeNames[BackgroundTypeNames["Vertical Copies"] = 2] = "Vertical Copies";
    BackgroundTypeNames[BackgroundTypeNames["H+V Copies"] = 3] = "H+V Copies";
    BackgroundTypeNames[BackgroundTypeNames["Horizontal Moving+Copies"] = 4] = "Horizontal Moving+Copies";
    BackgroundTypeNames[BackgroundTypeNames["Vertical Moving+Copies"] = 5] = "Vertical Moving+Copies";
    BackgroundTypeNames[BackgroundTypeNames["H+V Copies, Horizontal Moving"] = 6] = "H+V Copies, Horizontal Moving";
    BackgroundTypeNames[BackgroundTypeNames["H+V Copies, Vertical Moving"] = 7] = "H+V Copies, Vertical Moving";
})(BackgroundTypeNames || (BackgroundTypeNames = {}));
;
var BackgroundType;
(function (BackgroundType) {
    BackgroundType[BackgroundType["LensFlare"] = 0] = "LensFlare";
    BackgroundType[BackgroundType["unknown2"] = 1] = "unknown2";
    BackgroundType[BackgroundType["unknown3"] = 2] = "unknown3";
    BackgroundType[BackgroundType["unknown4"] = 3] = "unknown4";
    BackgroundType[BackgroundType["Clouds"] = 4] = "Clouds";
    BackgroundType[BackgroundType["unknown6"] = 5] = "unknown6";
})(BackgroundType || (BackgroundType = {}));
var BackgroundTile = (function () {
    function BackgroundTile() {
    }
    BackgroundTile.LoadBackground = function (item) {
        var bg = new BackgroundTile();
        bg.Tex = new Texture(ms.http.baseUrl + 'Map/Back/' + item.bS + '.img/back/' + item.no + '.png');
        bg.position = new Vector(item.x, item.y);
        bg.origin = new Vector(0, 0);
        bg.C = new Vector(item.cx, item.cy);
        bg.R = new Vector(item.rx, item.ry);
        if (item.type.type == 0)
            bg.Type = 0 /* LensFlare */;
        else
            bg.Type = 5 /* unknown6 */;
        return bg;
    };
    BackgroundTile.prototype.draw = function (ctx) {
        switch (this.Type) {
            case 0 /* LensFlare */:
                this.Tex.drawWithSize(ctx, 0, 0, ms.game.canvas.width, ms.game.canvas.height, false);
                break;
            case 4 /* Clouds */:
                this.Tex.draw(ctx, this.position.x - this.origin.x, this.position.y - this.origin.y, false);
        }
    };
    return BackgroundTile;
})();

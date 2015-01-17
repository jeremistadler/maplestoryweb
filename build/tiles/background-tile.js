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
var BackgroundSprite = (function () {
    function BackgroundSprite() {
    }
    //  Tint :Color;
    BackgroundSprite.prototype.draw = function (ctx) {
        this.Sprite.Tex.draw(ctx, Vector.plus(this.Position, this.Sprite.Offset));
        return;
        var pos;
        switch (this.Type) {
            case 1 /* unknown2 */:
                this.Sprite.Tex.draw(ctx, Vector.Zero, new Size(game.canvas.width, game.canvas.height));
                break;
            case 4 /* Clouds */:
        }
    };
    return BackgroundSprite;
})();

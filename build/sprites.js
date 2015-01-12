var TextureSprite = (function () {
    function TextureSprite(backgroundSprite, num) {
        this.Tex = new Texture("http://mapleassets.jeremi.se/Back/" + backgroundSprite + ".img/back/" + num + ".png");
        var inst = this;
        httpGetAsset("Back/" + backgroundSprite + ".img/properties.json", function (responce) {
            var origin = responce.back[num].origin.origin;
            inst.Offset = new Vector(origin.x, origin.y);
        });
    }
    return TextureSprite;
})();
var TextureAnimation = (function () {
    function TextureAnimation() {
    }
    return TextureAnimation;
})();
var Tile = (function () {
    function Tile() {
    }
    Tile.prototype.Draw = function (ctx) {
        this.Sprite.Tex.draw(ctx, this.Position);
    };
    return Tile;
})();
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
        this.Sprite.Tex.draw(ctx, this.Position);
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
var AnimationSprite = (function () {
    function AnimationSprite() {
    }
    AnimationSprite.prototype.Draw = function (ctx) {
        var index = Math.floor((game.totalGameTime / this.Anim.FrameLength) % this.Anim.Sprites.length);
        this.Anim.Sprites[index].Tex.draw(ctx, Vector.minus(this.Position, this.Anim.Sprites[index].Offset));
    };
    return AnimationSprite;
})();

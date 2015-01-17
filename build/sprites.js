var TextureSprite = (function () {
    function TextureSprite(path, offset) {
        this.Tex = new Texture(http.baseUrl + path + '.png');
        if (offset)
            this.Offset = offset;
        else {
            this.Offset = new Vector(0, 0);
            var inst = this;
            http.getJsonPropertyForPath(path, function (prop) {
                var origin = prop.origin;
                if (!origin || typeof origin.x != 'number')
                    debugger;
                inst.Offset = new Vector(origin.x, -origin.y);
            });
        }
    }
    return TextureSprite;
})();
var Tile = (function () {
    function Tile() {
    }
    Tile.prototype.draw = function (ctx) {
        this.Sprite.Tex.draw(ctx, Vector.plus(this.Position, this.Sprite.Offset));
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
var TextureAnimation = (function () {
    function TextureAnimation() {
        this.Sprites = [];
        this.FrameLength = 200;
    }
    return TextureAnimation;
})();
var AnimationSprite = (function () {
    function AnimationSprite(path, pos) {
        this.loaded = false;
        this.Position = pos;
        var instance = this;
        http.getJsonPropertyForPath(path, function (data) {
            instance.Anim = new TextureAnimation();
            var i = 0;
            for (var key in data) {
                var origin = data[key].origin;
                var sprite = new TextureSprite(path + '/0', origin);
                instance.Anim.Sprites.push(sprite);
                i++;
            }
            instance.loaded = true;
        });
    }
    AnimationSprite.prototype.draw = function (ctx) {
        if (!this.loaded)
            return;
        var index = Math.floor((game.totalGameTime / this.Anim.FrameLength) % this.Anim.Sprites.length);
        this.Anim.Sprites[index].Tex.draw(ctx, Vector.minus(this.Position, this.Anim.Sprites[index].Offset));
    };
    return AnimationSprite;
})();

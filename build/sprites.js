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
                inst.Offset = new Vector(origin.x, origin.y);
            });
        }
    }
    return TextureSprite;
})();
var Tile = (function () {
    function Tile() {
    }
    Tile.prototype.draw = function (ctx) {
        this.Sprite.Tex.draw(ctx, Vector.minus(this.Position, this.Sprite.Offset));
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
var AnimationFrame = (function () {
    function AnimationFrame(sprite, frameLength) {
        this.sprite = sprite;
        this.frameLength = frameLength;
    }
    return AnimationFrame;
})();
var AnimationSprite = (function () {
    function AnimationSprite(path, pos) {
        this.Frames = [];
        this.loaded = false;
        this.timeToNextFrame = 0;
        this.currentFrame = 0;
        this.Position = pos;
        var instance = this;
        http.getJsonPropertyForPath(path, function (data) {
            for (var key in data) {
                if (isNaN(key))
                    continue;
                var origin = data[key].origin;
                if (!origin)
                    continue;
                var frame = new AnimationFrame(new TextureSprite(path + '/0', new Vector(origin.x, origin.y)), data[key].delay || 200);
                instance.Frames.push(frame);
            }
            instance.loaded = true;
            instance.timeToNextFrame = instance.Frames[0].frameLength;
        });
    }
    AnimationSprite.prototype.draw = function (ctx) {
        if (!this.loaded)
            return;
        this.timeToNextFrame -= game.frameTime;
        while (this.timeToNextFrame < 0) {
            this.currentFrame = (this.currentFrame + 1) % this.Frames.length;
            this.timeToNextFrame += this.Frames[this.currentFrame].frameLength;
        }
        this.Frames[this.currentFrame].sprite.Tex.draw(ctx, Vector.minus(this.Position, this.Frames[this.currentFrame].sprite.Offset));
    };
    return AnimationSprite;
})();

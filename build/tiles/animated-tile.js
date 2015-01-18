/// <reference path="../main.ts" />
var AnimationFrame = (function () {
    function AnimationFrame(tex, frameLength, origin) {
        this.tex = tex;
        this.frameLength = frameLength;
        this.origin = origin;
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
                var frame = new AnimationFrame(new Texture(http.baseUrl + path + '/' + key + '.png'), data[key].delay || 200, new Vector(origin.x, origin.y));
                instance.Frames.push(frame);
            }
            instance.loaded = true;
            instance.timeToNextFrame = instance.Frames[0].frameLength;
        });
    }
    AnimationSprite.loadTiles = function (layer, tileList) {
        for (var objKey in layer["obj"]) {
            var item = layer["obj"][objKey];
            var x = item.x;
            var y = item.y;
            var z = item.zM;
            var u = item.oS;
            var l0 = item.l0;
            var l1 = item.l1;
            var l2 = item.l2;
            //if (l0 != 'house14' || l2 != 2)
            //    continue;
            var spriteName = "Map/Obj/" + u + ".img/" + l0 + "/" + l1 + "/" + l2;
            var animation = new AnimationSprite(spriteName, new Vector(x, y));
            animation.Z = z;
            animation.layer = parseInt(objKey);
            tileList.push(animation);
        }
    };
    AnimationSprite.prototype.draw = function (ctx) {
        if (!this.loaded)
            return;
        this.timeToNextFrame -= game.frameTime;
        while (this.timeToNextFrame < 0) {
            this.currentFrame = (this.currentFrame + 1) % this.Frames.length;
            this.timeToNextFrame += this.Frames[this.currentFrame].frameLength;
        }
        var frame = this.Frames[this.currentFrame];
        frame.tex.draw(ctx, new Vector(this.Position.x - frame.origin.x, this.Position.y - frame.origin.y));
    };
    return AnimationSprite;
})();

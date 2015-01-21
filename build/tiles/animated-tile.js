/// <reference path="../main.ts" />
var AnimationFrame = (function () {
    function AnimationFrame() {
    }
    return AnimationFrame;
})();
var AnimationSprite = (function () {
    function AnimationSprite(path, pos) {
        this.Frames = [];
        this.loaded = false;
        this.timeToNextFrame = 0;
        this.currentFrame = 0;
        this.position = pos;
        var instance = this;
        ms.http.getJsonPropertyForPath(path, function (data) {
            for (var key in data) {
                if (isNaN(key))
                    continue;
                var frame = new AnimationFrame();
                var origin = data[key].origin;
                var delay = data[key].delay || 600;
                if (!origin)
                    continue;
                frame.tex = new Texture(ms.http.baseUrl + path + '/' + key + '.png');
                frame.origin = new Vector(origin.x, origin.y);
                frame.id = parseInt(key);
                frame.frameLength = delay;
                instance.Frames.push(frame);
            }
            instance.Frames.sort(function (a, b) { return b.id - a.id; });
            instance.loaded = true;
            instance.timeToNextFrame = instance.Frames[0].frameLength;
        });
    }
    AnimationSprite.loadTiles = function (layer, tileList) {
        for (var objKey in layer["obj"]) {
            var item = layer["obj"][objKey];
            var x = item.x;
            var y = item.y;
            var z = item.z;
            var objectSet = item.oS;
            var l0 = item.l0;
            var l1 = item.l1;
            var l2 = item.l2;
            var quest = item.quest;
            //if (l0 != 'house14' || l2 != 2)
            //    continue;
            if (typeof item.piece === 'number')
                continue;
            var spriteName = "Map/Obj/" + objectSet + ".img/" + l0 + "/" + l1 + "/" + l2;
            var animation = new AnimationSprite(spriteName, new Vector(x, y));
            animation.z = z;
            animation.layer = layer.id;
            animation.flip = item.flip == '1';
            tileList.push(animation);
        }
    };
    AnimationSprite.prototype.draw = function (ctx) {
        if (!this.loaded)
            return;
        this.timeToNextFrame -= ms.game.frameTime;
        while (this.timeToNextFrame < 0) {
            this.currentFrame = (this.currentFrame + 1) % this.Frames.length;
            this.timeToNextFrame += this.Frames[this.currentFrame].frameLength;
        }
        var frame = this.Frames[this.currentFrame];
        var flipped = false;
        var topLeftX = this.position.x - frame.origin.x;
        var topLeftY = this.position.y - frame.origin.y;
        frame.tex.draw(ctx, new Vector(topLeftX, topLeftY));
    };
    return AnimationSprite;
})();

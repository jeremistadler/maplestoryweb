/// <reference path="main.ts" />
var CharacterAnimationFrame = (function () {
    function CharacterAnimationFrame(data, id, path, defaultDelay) {
        this.maps = {};
        var origin = data.origin;
        var delay = data.delay || defaultDelay;
        this.tex = new Texture(ms.http.baseUrl + path + '.png');
        this.origin = new Vector(origin.x, origin.y);
        this.id = id;
        this.frameLength = delay;
        this.z = data.z;
        for (var key in data.map) {
            var map = data.map[key];
            this.maps[key] = new Vector(map.x, map.y);
        }
    }
    return CharacterAnimationFrame;
})();
var CharacterPart = (function () {
    function CharacterPart() {
        this.timeToNextFrame = 0;
        this.currentFrame = 0;
        this.frames = [];
    }
    CharacterPart.prototype.draw = function (ctx, x, y, flip) {
        this.timeToNextFrame -= ms.game.frameTime;
        while (this.timeToNextFrame < 0) {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.timeToNextFrame += this.frames[this.currentFrame].frameLength;
        }
        var frame = this.frames[this.currentFrame];
        var topLeftX = x - frame.origin.x;
        var topLeftY = y - frame.origin.y;
        if (frame.z == "arm") {
            topLeftX += 6 + frame.maps["hand"].x;
            topLeftY -= 15 + frame.maps["hand"].y;
        }
        frame.tex.draw(ctx, topLeftX, topLeftY, flip);
    };
    return CharacterPart;
})();
var CharacterAnimation = (function () {
    function CharacterAnimation() {
        this.parts = [];
        this.loaded = false;
    }
    CharacterAnimation.prototype.draw = function (ctx, x, y, flip) {
        if (!this.loaded)
            return;
        for (var i = 0; i < this.parts.length; i++)
            this.parts[i].draw(ctx, x, y, flip);
    };
    return CharacterAnimation;
})();
var CharacterAnimator = (function () {
    function CharacterAnimator(path, animationNames) {
        this.loaded = false;
        this.animations = {};
        for (var i = 0; i < animationNames.length; i++)
            this.loadAnimation(path, animationNames[i]);
    }
    CharacterAnimator.prototype.loadAnimation = function (basePath, animationName) {
        var instance = this;
        ms.http.getJsonPropertyForPath(basePath + '/' + animationName, function (data) {
            var body = new CharacterPart();
            var arm = new CharacterPart();
            var animation = new CharacterAnimation();
            animation.parts.push(body);
            animation.parts.push(arm);
            instance.animations[animationName] = animation;
            for (var key in data) {
                if (isNaN(key))
                    continue;
                var id = parseInt(key);
                body.frames.push(new CharacterAnimationFrame(data[key].body, id, basePath + '/' + animationName + "/" + key + "/body", data[key].delay));
                arm.frames.push(new CharacterAnimationFrame(data[key].arm, id, basePath + '/' + animationName + "/" + key + "/arm", data[key].delay));
            }
            body.frames.sort(function (a, b) { return b.id - a.id; });
            arm.frames.sort(function (a, b) { return b.id - a.id; });
            animation.loaded = true;
        });
    };
    CharacterAnimator.prototype.draw = function (ctx, x, y, flip, animationName) {
        this.animations[animationName].draw(ctx, x, y, flip);
    };
    return CharacterAnimator;
})();

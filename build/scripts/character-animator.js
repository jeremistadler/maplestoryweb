var CharacterAnimationFrame = (function () {
    function CharacterAnimationFrame(ms, data, id, path, defaultDelay) {
        this.ms = ms;
        this.maps = {};
        this.frameLength = data.delay || defaultDelay || 300;
        this.originalFrameLength = defaultDelay;
        this.tex = new Texture(ms, ms.http.baseUrl + path + '.png');
        this.offset = new Vector(data.origin.x, data.origin.y);
        this.id = id;
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
        this.isGoingBackwards = false;
        this.frames = [];
    }
    CharacterPart.prototype.draw = function (frameTime, ctx, x, y, flip) {
        if (this.frames.length == 0)
            return;
        this.timeToNextFrame -= frameTime;
        while (this.timeToNextFrame < 0) {
            if ((this.currentFrame == 0 && this.isGoingBackwards) ||
                (this.currentFrame == this.frames.length - 1 && !this.isGoingBackwards))
                this.isGoingBackwards = !this.isGoingBackwards;
            this.currentFrame += this.isGoingBackwards ? -1 : 1;
            this.currentFrame = Math.max(0, Math.min(this.currentFrame, this.frames.length - 1));
            this.timeToNextFrame += this.frames[this.currentFrame].frameLength;
        }
        var frame = this.frames[this.currentFrame];
        var topLeftX = x - frame.offset.x;
        var topLeftY = y - frame.offset.y;
        var bodyMap = {
            neck: { x: 0, y: -30 },
            hand: { x: 10, y: -15 },
            navel: { x: 0, y: 5 }
        };
        var bodypartMap = {
            arm: { x: 0, y: -30 },
            body: { x: 10, y: -15 },
            head: { x: 0, y: 5 }
        };
        var aa = bodypartMap[frame.z];
        if (!aa)
            debugger;
        topLeftX += aa.x;
        topLeftY += aa.y;
        frame.tex.draw(ctx, topLeftX, topLeftY, flip);
    };
    return CharacterPart;
})();
var CharacterAnimation = (function () {
    function CharacterAnimation(name) {
        this.name = name;
        this.parts = [];
        this.loaded = false;
    }
    CharacterAnimation.prototype.draw = function (frameTime, ctx, x, y, flip) {
        if (!this.loaded)
            return;
        for (var i = 0; i < this.parts.length; i++)
            this.parts[i].draw(frameTime, ctx, x, y, flip);
    };
    return CharacterAnimation;
})();
var CharacterAnimator = (function () {
    function CharacterAnimator(ms, paths, animationNames) {
        this.ms = ms;
        this.loaded = false;
        this.animations = {};
        for (var i = 0; i < animationNames.length; i++) {
            var animation = new CharacterAnimation(animationNames[i]);
            this.animations[animationNames[i]] = animation;
            for (var q = 0; q < paths.length; q++) {
                this.loadAnimation(paths[q], animationNames[i]);
            }
        }
    }
    CharacterAnimator.prototype.loadAnimation = function (basePath, animationName) {
        var _this = this;
        this.ms.http.getJsonPropertyForPath(basePath + '/' + animationName, function (data) {
            var partLookup = {};
            var animation = _this.animations[animationName];
            for (var key in data) {
                var id = parseInt(key);
                if (isNaN(id))
                    continue;
                for (var partName in data[key]) {
                    if (typeof data[key][partName] !== 'object')
                        continue;
                    var part = partLookup[partName];
                    if (!part) {
                        part = new CharacterPart();
                        partLookup[partName] = part;
                        animation.parts.push(part);
                    }
                    part.frames.push(new CharacterAnimationFrame(_this.ms, data[key][partName], id, basePath + '/' + animationName + "/" + key + "/" + partName, data[key].delay));
                }
            }
            for (var i = 0; i < animation.parts.length; i++)
                animation.parts[i].frames.sort(function (a, b) { return b.id - a.id; });
            animation.loaded = true;
        });
    };
    CharacterAnimator.prototype.draw = function (ctx, x, y, flip, animationName, frameTime) {
        this.animations[animationName].draw(frameTime, ctx, x, y, flip);
    };
    return CharacterAnimator;
})();

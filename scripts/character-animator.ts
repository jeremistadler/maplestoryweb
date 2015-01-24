/// <reference path="main.ts" />

class CharacterAnimationFrame {
    public id: number;
    public tex: Texture;
    public frameLength: number;
    public origin: Vector;
    public z: string;
    public maps: { [name: string]: Vector } = {};

    constructor(data, id, path, defaultDelay) {
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
}

class CharacterPart {
    timeToNextFrame: number = 0;
    currentFrame: number = 0;
    public frames: CharacterAnimationFrame[] = [];
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean) {
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
    }
}

class CharacterAnimation {
    parts: CharacterPart[] = [];
    loaded: boolean = false;

    draw(ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean) {
        if (!this.loaded) return;

        for (var i = 0; i < this.parts.length; i++)
            this.parts[i].draw(ctx, x, y, flip);
    }
}

class CharacterAnimator {
    loaded: boolean = false;
    animations: { [name: string]: CharacterAnimation } = {};

    constructor(path: string, animationNames: string[]) {
        for (var i = 0; i < animationNames.length; i++)
            this.loadAnimation(path, animationNames[i]);
    }

    loadAnimation(basePath: string, animationName: string) {
        var instance = this;
        ms.http.getJsonPropertyForPath(basePath + '/' + animationName, (data) => {
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

            body.frames.sort((a, b) => b.id - a.id);
            arm.frames.sort((a, b) => b.id - a.id);

            animation.loaded = true;
        });
    }

    draw(ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean, animationName: string) {
        this.animations[animationName].draw(ctx, x, y, flip);
    }
}

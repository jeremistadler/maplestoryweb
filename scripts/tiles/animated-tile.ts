/// <reference path="../main.ts" />

class AnimationFrame {
    constructor(public tex: Texture, public frameLength: number, public origin: Vector) { }
}

class AnimationSprite {
    Frames: AnimationFrame[] = [];
    Position: Vector;
    Z: number;
    loaded: boolean = false;
    layer: number;
    timeToNextFrame: number = 0;
    currentFrame: number = 0;

    constructor(path: string, pos: Vector) {
        this.Position = pos;
        var instance = this;
        http.getJsonPropertyForPath(path, (data) => {
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

    static loadTiles(layer, tileList: AnimationSprite[]) {
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
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.loaded) return;

        this.timeToNextFrame -= game.frameTime;
        while (this.timeToNextFrame < 0) {
            this.currentFrame = (this.currentFrame + 1) % this.Frames.length;
            this.timeToNextFrame += this.Frames[this.currentFrame].frameLength;
        }

        var frame = this.Frames[this.currentFrame];
        frame.tex.draw(ctx, new Vector(this.Position.x - frame.origin.x, this.Position.y - frame.origin.y));
    }
}

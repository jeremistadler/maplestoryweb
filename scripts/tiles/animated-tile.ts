/// <reference path="../main.ts" />

class AnimationFrame {
    public id: number;
    public tex: Texture;
    public frameLength: number;
    public origin: Vector
}

class AnimationSprite implements ILayeredTile, ITile {
    Frames: AnimationFrame[] = [];
    position: Vector;
    z: number;
    loaded: boolean = false;
    layer: number;
    timeToNextFrame: number = 0;
    currentFrame: number = 0;

    constructor(path: string, pos: Vector) {
        this.position = pos;
        var instance = this;
        ms.http.getJsonPropertyForPath(path, (data) => {
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

            instance.Frames.sort((a, b) => b.id - a.id);

            instance.loaded = true;
            instance.timeToNextFrame = instance.Frames[0].frameLength;
        });
    }

    static loadTiles(layer, tileList: ILayeredTile[]) {
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
            animation.z = z;
            animation.layer = layer.id;
            tileList.push(animation);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.loaded) return;

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
    }
}

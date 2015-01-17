class TextureSprite
{
    Tex: Texture;
    Offset: Vector;

    constructor(path, offset?: Vector) {
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
}


class Tile
{
    Sprite: TextureSprite;
    Position: Vector;
    //Tint: Color;
    Z: number; 

    draw(ctx: CanvasRenderingContext2D)
    {
        this.Sprite.Tex.draw(ctx, Vector.minus(this.Position, this.Sprite.Offset));
    }
}


enum BackgroundType {
    LensFlare,
    unknown2,
    unknown3,
    unknown4,
    Clouds,
    unknown6
}

    class BackgroundSprite
    {
        Type: BackgroundType;
        Sprite: TextureSprite;

        C: Vector;
        R: Vector;
        Position: Vector;
        //  Tint :Color;

        draw(ctx: CanvasRenderingContext2D)
        {
            this.Sprite.Tex.draw(ctx, Vector.plus(this.Position, this.Sprite.Offset));
            return;

            var pos: Vector;
    switch (this.Type) {
        case BackgroundType.unknown2:
             this.Sprite.Tex.draw(ctx, Vector.Zero, new Size(game.canvas.width, game.canvas.height));
            break;

        case BackgroundType.Clouds:
            //var pos = Vector.plus(new Vector(game.totalGameTime % 100, 0), Position);
            //batch.Draw(Sprite.Tex, pos, Color.White);
            //batch.RectangleStroke(pos, new Vector2(Sprite.Tex.Width, Sprite.Tex.Height), 1, Color.Red, 0);
            //batch.DrawStringWithShadowCheap(Game1.Font, "R: " + R + "\r\nC: " + C + "\r\nO: " + Sprite.Offset + "\r\nt: " + Type, pos);
            //break;
        //case BackgroundType.LensFlare:
        //    pos = Camera.Position * R * -0.1f + Position;
        //    batch.Draw(Sprite.Tex, pos, Color.White);
        //    batch.RectangleStroke(pos, new Vector2(Sprite.Tex.Width, Sprite.Tex.Height), 1, Color.Red, 0);
        //    batch.DrawStringWithShadowCheap(Game1.Font, "R: " + R + "\r\nC: " + C + "\r\nO: " + Sprite.Offset + "\r\nt: " + Type, pos);
        //    break;
        //case BackgroundType.unknown3:
        //case BackgroundType.unknown4:
        //case BackgroundType.unknown6:
        //    pos = Camera.Position * R * -0.1f + Position;
        //    batch.Draw(Sprite.Tex, pos, Color.White);
        //    batch.RectangleStroke(pos, new Vector2(Sprite.Tex.Width, Sprite.Tex.Height), 1, Color.Red, 0);
        //    batch.DrawStringWithShadowCheap(Game1.Font, "R: " + R + "\r\nC: " + C + "\r\nO: " + Sprite.Offset + "\r\nt: " + Type, pos);

            //break;
    }
            
        }
}


class AnimationFrame {
    constructor(public sprite: TextureSprite, public frameLength: number) { }
}

class AnimationSprite
{
    Frames: AnimationFrame[] = [];
    Position: Vector; 
    Z: number; 
    loaded: boolean = false;
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

                var frame = new AnimationFrame(new TextureSprite(path + '/0', new Vector(origin.x, origin.y)), data[key].delay || 200);
                instance.Frames.push(frame);
            }

            instance.loaded = true;
            instance.timeToNextFrame = instance.Frames[0].frameLength;
        });
    }

    draw(ctx: CanvasRenderingContext2D)
    {
        if (!this.loaded) return;

        this.timeToNextFrame -= game.frameTime;
        while (this.timeToNextFrame < 0) {
            this.currentFrame = (this.currentFrame + 1) % this.Frames.length;
            this.timeToNextFrame += this.Frames[this.currentFrame].frameLength;
        }

        this.Frames[this.currentFrame].sprite.Tex.draw(ctx, Vector.minus(this.Position, this.Frames[this.currentFrame].sprite.Offset));
    }
}

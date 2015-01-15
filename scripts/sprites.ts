class TextureSprite
{
    Tex: Texture;
    Offset: Vector;

    constructor(path) {
        this.Tex = new Texture(http.baseUrl + path + '.png'); 
        this.Offset = new Vector(0, 0);
        var inst = this;

        http.getJsonPropertyForPath(path, function (prop) 
        { 
            var origin = prop;
            inst.Offset = new Vector(origin.x, origin.y); 
        });
    }
}

class TextureAnimation
{
    Sprites: TextureSprite[];
    FrameLength: number;
}


class Tile
{
    Sprite: TextureSprite;
    Position: Vector;
    //Tint: Color;
    Z: number; 

    draw(ctx: CanvasRenderingContext2D)
    {
        this.Sprite.Tex.draw(ctx, this.Position);
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
            this.Sprite.Tex.draw(ctx, this.Position);
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

    class AnimationSprite
    {
        Anim: TextureAnimation;
        Position: Vector; 
        Z: number; 

        Draw(ctx: CanvasRenderingContext2D)
        {
            var index = Math.floor((game.totalGameTime / this.Anim.FrameLength) % this.Anim.Sprites.length);
            this.Anim.Sprites[index].Tex.draw(ctx, Vector.minus(this.Position, this.Anim.Sprites[index].Offset));
        }
    }

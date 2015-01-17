/// <reference path="../main.ts" />

enum BackgroundTypeNames {
    "Regular",
    "Horizontal Copies",
    "Vertical Copies",
    "H+V Copies",
    "Horizontal Moving+Copies",
    "Vertical Moving+Copies",
    "H+V Copies, Horizontal Moving",
    "H+V Copies, Vertical Moving"
};


enum BackgroundType {
    LensFlare,
    unknown2,
    unknown3,
    unknown4,
    Clouds,
    unknown6
}

class BackgroundSprite {
    Type: BackgroundType;
    Sprite: TextureSprite;

    C: Vector;
    R: Vector;
    Position: Vector;
    //  Tint :Color;

    draw(ctx: CanvasRenderingContext2D) {
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

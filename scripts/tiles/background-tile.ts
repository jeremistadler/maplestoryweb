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

class BackgroundTile implements ITile {
    Type: BackgroundType;
    Tex: Texture;
    origin: Vector;

    C: Vector;
    R: Vector;
    position: Vector;

    static LoadBackground(item: any): BackgroundTile {
        var bg = new BackgroundTile();
        bg.Tex = new Texture(ms.http.baseUrl + 'Map/Back/' + item.bS + '.img/back/' + item.no + '.png');
        bg.position = new Vector(item.x, item.y);
        bg.origin = new Vector(0, 0);
        bg.C = new Vector(item.cx, item.cy);
        bg.R = new Vector(item.rx, item.ry);
        if (item.type.type == 0) bg.Type = BackgroundType.LensFlare;
        else bg.Type = BackgroundType.unknown6;

        return bg;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.Tex.draw(ctx, Vector.minus(this.position, this.origin));
        return;

        var pos: Vector;
        switch (this.Type) {
            case BackgroundType.LensFlare:
                this.Tex.draw(ctx, Vector.Zero, new Size(ms.game.canvas.width, ms.game.canvas.height));
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

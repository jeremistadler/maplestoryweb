/// <reference path="../main.ts" />

enum BackgroundType {
    "Regular",
    "HorizontalCopies",
    "VerticalCopies",
    "HVCopies",
    "HorizontalMovingCopies",
    "VerticalMovingCopies",
    "HVCopiesHorizontalMoving",
    "HVCopiesVerticalMoving"   
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
        bg.Type = <BackgroundType>item.type;

        return bg;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.Tex.hasLoaded) return;

        switch (this.Type) {
            case BackgroundType.Regular:
                //this.Tex.draw(ctx, this.position.x, this.position.y, false);
                break;

            case BackgroundType.HorizontalCopies:
                var start = ms.camera.boundsLeft % this.Tex.image.width;
                var cameraWidth = (ms.camera.boundsRight - ms.camera.boundsLeft);
                var end = start + cameraWidth * 2;
                for (var i = start; i < end; i += this.Tex.image.width) {
                    this.Tex.draw(ctx, i + this.position.x, this.position.y, false);
                }
            case BackgroundType.VerticalCopies:

                break;


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

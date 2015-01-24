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
    flip: boolean;

    C: Vector;
    R: Vector;
    position: Vector;

    static LoadBackground(item: any): BackgroundTile {
        var bg = new BackgroundTile();
        bg.Tex = new Texture(ms.http.baseUrl + 'Map/Back/' + item.bS + '.img/back/' + item.no + '.png');
        bg.position = new Vector(item.x, item.y);
        bg.origin = new Vector(0, 0);
        bg.C = new Vector(item.cx || 0, item.cy || 0);
        bg.R = new Vector(item.rx || 0, item.ry || 0);
        bg.Type = <BackgroundType>item.type;
        bg.flip = item.flip > 0;

        return bg;
    }

    drawHorizontalCopies(ctx: CanvasRenderingContext2D, x: number, y: number, cx: number)
        {
            var width = this.Tex.image.width;
            this.Tex.draw(ctx, x, y, this.flip);


            var copyX = x - cx;
            while (copyX + width > 0) {
                this.Tex.draw(ctx, copyX, y, this.flip);
                copyX -= cx;
            }


            copyX = x + cx;
            while (copyX < ms.camera.width) {
                this.Tex.draw(ctx, copyX, y, this.flip);
                copyX += cx;
            }
        }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.Tex.hasLoaded) return;

        var x = this.position.x + this.R.x * -ms.camera.centerX * 0.01;
        var y = this.position.y + 300 + ((this.R.y * (-ms.camera.centerY + 300)) / 100);

        var cx = this.C.x || this.Tex.image.width;
        var cy = this.C.y || this.Tex.image.height;

        switch (this.Type) {
            case BackgroundType.Regular:
                this.Tex.draw(ctx, x, y, this.flip);
                break;

            case BackgroundType.HorizontalCopies:
                this.drawHorizontalCopies(ctx, x, y, cy);

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

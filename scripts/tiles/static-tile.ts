
class Tile {
    Sprite: TextureSprite;
    Position: Vector;
    //Tint: Color;
    Z: number;

    constructor() {

    }

    static loadTiles(layer, tileList : Tile[]) {
        for (var tileKey in layer.tile) {
            var item = layer.tile[tileKey];
            var x = item.x;
            var y = item.y;
            var z = item.zM;
            var u = item.u;
            var no = item.no;

            var tile = new Tile();
            tile.Sprite = new TextureSprite('Map/Tile/' + layer.info.tS + '.img/' + u + '/' + no);
            tile.Position = new Vector(x, y);
            tile.Z = parseInt(tileKey);
            tileList.push(tile);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.Sprite.Tex.draw(ctx, Vector.minus(this.Position, this.Sprite.Offset));
    }
}
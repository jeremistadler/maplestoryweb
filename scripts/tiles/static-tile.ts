/// <reference path="../main.ts" />

class Tile {
    Position: Vector;
    origin: Vector;
    //Tint: Color;
    Z: number;
    layer: number;
    Tex: Texture;

    static loadTiles(layer, tileList : Tile[]) {
        for (var tileKey in layer.tile) {
            var item = layer.tile[tileKey];
            var x = item.x;
            var y = item.y;
            var z = item.zM;
            var u = item.u;
            var no = item.no;

            var path = 'Map/Tile/' + layer.info.tS + '.img/' + u + '/' + no;
            var tile = new Tile();
            tile.Position = new Vector(x, y);
            tile.Z = parseInt(tileKey);
            tile.Tex = new Texture(http.baseUrl + path + '.png');
            tile.origin = new Vector(0, 0);
            Tile.loadTileMetadata(tile, path);
            tile.layer = parseInt(tileKey);
            tileList.push(tile);
        }
    }

    static loadTileMetadata(tile, path) {
        http.getJsonPropertyForPath(path, function (prop) {
            var origin = prop.origin;
            if (!origin || typeof origin.x != 'number')
                debugger;
            tile.origin = new Vector(origin.x, origin.y);
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.Tex.draw(ctx, Vector.minus(this.Position, this.origin));
    }
}
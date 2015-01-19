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
            tile.layer = layer.id;
            tile.Z = parseInt(tileKey);
            tile.Position = new Vector(x, y);
            tile.origin = new Vector(0, 1000);
            tile.Tex = new Texture(http.baseUrl + path + '.png');
            Tile.loadTileMetadata(tile, path);

            if (tile.layer == 1)
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
        var x = this.Position.x - this.origin.x;
        var y = this.Position.y - this.origin.y;

        this.Tex.draw(ctx, new Vector(x, y));

        if (this.Tex.hasLoaded) {
            ctx.fillStyle = 'hsla(' + ((this.Z) % 360) + ', 50%, 50%, 0.4)';
            ctx.fillRect(x, y, this.Tex.image.width, this.Tex.image.height);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillText('origin: x: ' + this.origin.x + '  y: ' + this.origin.y, x, y);
        }
    }
}
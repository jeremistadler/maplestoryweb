/// <reference path="../main.ts" />

interface ITile {
    draw(ctx: CanvasRenderingContext2D): void;
}

interface ILayeredTile {
    draw(ctx: CanvasRenderingContext2D): void;
    position: Vector;
    z: number;
    layer: number;
}

class StaticTile implements ILayeredTile, ITile {
    position: Vector;
    origin: Vector;
    z: number;
    layer: number;
    Tex: Texture;

    static loadTiles(ms: IEngine, layer, tileList : ILayeredTile[]) {
        for (var tileKey in layer.tile) {
            var item = layer.tile[tileKey];
            var x = item.x;
            var y = item.y;
            var z = item.zM;
            var u = item.u;
            var no = item.no;

            var path = 'Map/Tile/' + layer.info.tS + '.img/' + u + '/' + no;
            var tile = new StaticTile();
            tile.layer = layer.id;
            tile.z = parseInt(tileKey);
            tile.position = new Vector(x, y);
            tile.origin = new Vector(0, 1000);
            tile.Tex = new Texture(ms, ms.http.baseUrl + path + '.png');
            StaticTile.loadTileMetadata(ms, tile, path);

            if (tile.layer < 7)
                tileList.push(tile);
        }
    }

    static loadTileMetadata(ms: IEngine, tile, path) {
        ms.http.getJsonPropertyForPath(path, function (prop) {
            var origin = prop.origin;
            if (!origin || typeof origin.x != 'number')
                debugger;
            tile.origin = new Vector(origin.x, origin.y);
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        var x = this.position.x - this.origin.x;
        var y = this.position.y - this.origin.y;

        this.Tex.draw(ctx, x, y, false);
    }
}

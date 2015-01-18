/// <reference path="../main.ts" />
var Tile = (function () {
    function Tile() {
    }
    Tile.loadTiles = function (layer, tileList) {
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
    };
    Tile.loadTileMetadata = function (tile, path) {
        http.getJsonPropertyForPath(path, function (prop) {
            var origin = prop.origin;
            if (!origin || typeof origin.x != 'number')
                debugger;
            tile.origin = new Vector(origin.x, origin.y);
        });
    };
    Tile.prototype.draw = function (ctx) {
        this.Tex.draw(ctx, Vector.minus(this.Position, this.origin));
    };
    return Tile;
})();

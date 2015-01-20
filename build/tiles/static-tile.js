/// <reference path="../main.ts" />
var StaticTile = (function () {
    function StaticTile() {
    }
    StaticTile.loadTiles = function (layer, tileList) {
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
            tile.Tex = new Texture(http.baseUrl + path + '.png');
            StaticTile.loadTileMetadata(tile, path);
            if (tile.layer < 7)
                tileList.push(tile);
        }
    };
    StaticTile.loadTileMetadata = function (tile, path) {
        http.getJsonPropertyForPath(path, function (prop) {
            var origin = prop.origin;
            if (!origin || typeof origin.x != 'number')
                debugger;
            tile.origin = new Vector(origin.x, origin.y);
        });
    };
    StaticTile.prototype.draw = function (ctx) {
        var x = this.position.x - this.origin.x;
        var y = this.position.y - this.origin.y;
        this.Tex.draw(ctx, new Vector(x, y));
    };
    return StaticTile;
})();

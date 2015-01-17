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
            var tile = new Tile();
            tile.Sprite = new TextureSprite('Map/Tile/' + layer.info.tS + '.img/' + u + '/' + no);
            tile.Position = new Vector(x, y);
            tile.Z = parseInt(tileKey);
            tileList.push(tile);
        }
    };
    Tile.prototype.draw = function (ctx) {
        this.Sprite.Tex.draw(ctx, Vector.minus(this.Position, this.Sprite.Offset));
    };
    return Tile;
})();

var World = (function () {
    function World(ms) {
        this.ms = ms;
        this.Footholds = [];
        this.portals = [];
        this.Backgrounds = [];
        this.LayeredTiles = [];
        this.loaded = false;
        this.center = new Vector(0, 0);
        this.mapLoadedEvent = new MapleEvent();
        this.mapLoadingEvent = new MapleEvent();
        this.mapUnloadingEvent = new MapleEvent();
    }
    World.prototype.loadMap = function (id, targetPortal) {
        var _this = this;
        this.mapUnloadingEvent.trigger();
        this.loaded = false;
        this.Footholds = [];
        this.LayeredTiles = [];
        this.Backgrounds = [];
        this.portals = [];
        this.Id = id;
        this.targetPortal = targetPortal;
        this.BasePath = 'Map/Map/Map' + id.toString().substr(0, 1) + '/' + this.Id + '.img/';
        this.ms.http.httpGetAsset(this.BasePath + 'properties.json', function (data) { return _this.loadData(data); });
    };
    World.prototype.loadData = function (mapData) {
        var _this = this;
        this.size = new Size(mapData.miniMap.width, mapData.miniMap.height);
        this.center = new Vector(mapData.miniMap.centerX, mapData.miniMap.centerY);
        this.name = mapData.info.mapMark;
        this.Footholds = Foothold.loadFootholds(mapData.foothold);
        this.portals = Portal.loadPortals(this.ms, mapData.portal);
        this.ms.player.moveToPortal(this.targetPortal);
        this.ms.camera.moveToPlayer();
        for (var key in mapData.back) {
            var item = mapData.back[key];
            var back = BackgroundTile.LoadBackground(this.ms, item, parseInt(key));
            this.Backgrounds.push(back);
        }
        this.Backgrounds.sort(function (a, b) { return b.z - a.z; });
        for (var key in mapData) {
            var layer = mapData[key];
            var id = parseInt(key);
            if (isNaN(id))
                continue;
            layer.id = id;
            if (layer.info && layer.info.tS)
                StaticTile.loadTiles(this.ms, layer, this.LayeredTiles);
            AnimationSprite.loadTiles(this.ms, layer, this.LayeredTiles);
        }
        this.LayeredTiles.sort(function (a, b) { return (a.layer * 1000 + a.z) - (b.layer * 1000 + b.z); });
        this.mapLoadingEvent.trigger(mapData);
        window.setTimeout(function () {
            _this.ms.map.loaded = true;
            _this.ms.map.mapLoadedEvent.trigger();
        }, 500);
    };
    World.prototype.update = function () { };
    World.prototype.draw = function () {
        //for (var i = 0; i < this.Backgrounds.length; i++)
        //    this.Backgrounds[i].draw(this.ms.game.ctx);
        for (var i = 0; i < this.LayeredTiles.length; i++)
            this.LayeredTiles[i].draw(this.ms.game.ctx);
        //game.ctx.beginPath();
        //game.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        //game.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        //game.ctx.lineWidth = 1;
        //for (var i = 0; i < this.Footholds.length; i++)
        //    this.Footholds[i].draw(game.ctx);
        //game.ctx.fill();
        //game.ctx.stroke();
        //game.ctx.beginPath();
        //game.ctx.fillStyle = 'rgba(200, 0, 0, 0.3)';
        //game.ctx.strokeStyle = 'rgba(200, 0, 0, 0.5)';
        //game.ctx.lineWidth = 1;
        //for (var i = 0; i < this.Footholds.length; i++)
        //    if (this.Footholds[i].playerTouches)
        //        this.Footholds[i].draw(game.ctx);
        //game.ctx.fill();
        //game.ctx.stroke();
        this.ms.game.ctx.beginPath();
        for (var i = 0; i < this.portals.length; i++)
            this.portals[i].draw(this.ms.game.ctx);
    };
    return World;
})();

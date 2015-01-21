/// <reference path="main.ts" />

class World {
    Footholds: Foothold[] = [];
    portals: Portal[] = [];
    Id: number;
    BasePath: string;
    Backgrounds: BackgroundTile[] = [];
    LayeredTiles: ILayeredTile[] = [];
    loaded: boolean = false;
    size: Size;
    center: Vector = new Vector(0, 0);
    targetPortal: string;
    mapLoadedEvent: MapleEvent<void> = new MapleEvent<void>();
    name: string;

    loadMap(id: number, targetPortal: string) {
        this.loaded = false;
        this.Footholds = [];
        this.LayeredTiles = [];
        this.Backgrounds = [];
        this.portals = [];
        this.Id = id;
        this.targetPortal = targetPortal;
        this.BasePath = 'Map/Map/Map' + id.toString().substr(0, 1) + '/' + this.Id + '.img/';
        var instance = this;
        ms.http.httpGetAsset(this.BasePath + 'properties.json', function (data) { instance.loadData(data) });
    }

    loadData(mapData) {
        this.size = new Size(mapData.miniMap.width, mapData.miniMap.height);
        this.center = new Vector(mapData.miniMap.centerX, mapData.miniMap.centerY);
        this.name = mapData.info.mapMark;

        this.Footholds = Foothold.loadFootholds(mapData.foothold);
        this.portals = Portal.loadPortals(mapData.portal);

        ms.player.moveToPortal(this.targetPortal);
        ms.camera.moveToPlayer();

        for (var key in mapData.back) {
        	var item = mapData.back[key];
            //var back = BackgroundTile.LoadBackground(item);
        	//this.Backgrounds.push(back);
        }

        for (var key in mapData) {
            var layer = mapData[key];
            var id = parseInt(key);

            if (isNaN(id))
                continue;

            layer.id = id;

            //if (layer.id != 1) continue;

            if (layer.info && layer.info.tS)
                StaticTile.loadTiles(layer, this.LayeredTiles);

            AnimationSprite.loadTiles(layer, this.LayeredTiles);
        }

        this.LayeredTiles.sort((a, b) => (a.layer * 1000 + a.z) - (b.layer * 1000 + b.z) );
        this.loaded = true;
        this.mapLoadedEvent.trigger();
    }

    update() { }
    draw() {

        for (var i = 0; i < this.Backgrounds.length; i++)
            this.Backgrounds[i].draw(ms.game.ctx);

        for (var i = 0; i < this.LayeredTiles.length; i++)
            this.LayeredTiles[i].draw(ms.game.ctx);

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

        ms.game.ctx.beginPath();
        for (var i = 0; i < this.portals.length; i++)
            this.portals[i].draw(ms.game.ctx);
    }
}
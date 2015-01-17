/// <reference path="main.ts" />

class World {
    Footholds: Foothold[] = [];
    portals: Portal[] = [];
    Id: string;
    BasePath: string;
    Backgrounds: BackgroundSprite[] = [];
    Animations: AnimationSprite[] = [];
    Tiles: Tile[] = [];
    loaded: boolean = false;

    init(id: string) {
        this.Id = id;
        this.BasePath = 'Map/Map/Map' + this.Id.substr(0, 1) + '/' + this.Id + '.img/';
        var instance = this;
        http.httpGetAsset(this.BasePath + 'properties.json', function (data) { instance.loadData(data) });

    }

    loadData(mapData) {
        this.Footholds = Foothold.loadFootholds(mapData.foothold);
        this.portals = Portal.loadPortals(mapData.portal);

        //for (var key in mapData.back) {
        //	var item = mapData.back[key];
        //	var bg = new BackgroundSprite();
        //	bg.Sprite = new TextureSprite('Map/Back/' + item.bS + '.img/back/' + item.no);
        //	bg.Position = new Vector(item.x, item.y);
        //	bg.C = new Vector(item.cx, item.cy);
        //	bg.R = new Vector(item.rx, item.ry);
        //	if (item.type.type == 0) bg.Type = BackgroundType.LensFlare;
        //	else bg.Type = BackgroundType.unknown6;

        //	this.Backgrounds.push(bg);
        //}

        for (var key in mapData) {
            var layer = mapData[key];
            if (!layer.info || !layer.info.tS)
                continue;

            Tile.loadTiles(layer, this.Tiles);
            AnimationSprite.loadTiles(layer, this.Animations);
        }

        this.Tiles.sort((a, b) => a.Z - b.Z);
        this.Animations.sort((a, b) => a.Z - b.Z);

        this.loaded = true;
    }

    update() { }
    draw() {

        for (var i = 0; i < this.Backgrounds.length; i++)
            this.Backgrounds[i].draw(game.ctx);

        for (var i = 0; i < this.Animations.length; i++)
            this.Animations[i].draw(game.ctx);


        for (var i = 0; i < this.Tiles.length; i++)
            this.Tiles[i].draw(game.ctx);

        game.ctx.beginPath();
        game.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        game.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        game.ctx.lineWidth = 1;
        for (var i = 0; i < this.Footholds.length; i++)
            this.Footholds[i].draw(game.ctx);
        game.ctx.fill();
        game.ctx.stroke();

        game.ctx.beginPath();
        game.ctx.fillStyle = 'rgba(200, 0, 0, 0.3)';
        game.ctx.strokeStyle = 'rgba(200, 0, 0, 0.5)';
        game.ctx.lineWidth = 1;
        for (var i = 0; i < this.Footholds.length; i++)
            if (this.Footholds[i].playerTouches)
                this.Footholds[i].draw(game.ctx);
        game.ctx.fill();
        game.ctx.stroke();

        game.ctx.beginPath();
        for (var i = 0; i < this.portals.length; i++)
            this.portals[i].draw(game.ctx);
    }
}
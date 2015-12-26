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
  bounds: Rectangle = new Rectangle(0, 0, 1, 1);
  targetPortal: string;
  mapLoadedEvent: MapleEvent<void> = new MapleEvent<void>();
  mapLoadingEvent: MapleEvent<any> = new MapleEvent<any>();
  mapUnloadingEvent: MapleEvent<void> = new MapleEvent<void>();
  name: string;

  constructor(private ms: IEngine) { }

  loadMap(id: number, targetPortal: string) {
    this.mapUnloadingEvent.trigger();
    this.loaded = false;
    this.Footholds = [];
    this.LayeredTiles = [];
    this.Backgrounds = [];
    this.portals = [];
    this.Id = id;
    this.targetPortal = targetPortal;
    this.BasePath = 'Map/Map/Map' + id.toString().substr(0, 1) + '/' + this.Id + '.img/';
    this.ms.http.httpGetAsset(this.BasePath + 'properties.json', data => this.loadData(data));
  }

  loadData(mapData: any) {
    this.size = new Size(mapData.miniMap.width, mapData.miniMap.height);
    this.center = new Vector(mapData.miniMap.centerX, mapData.miniMap.centerY);
    this.name = mapData.info.mapMark;

    this.Footholds = Foothold.loadFootholds(mapData.foothold);
    this.portals = Portal.loadPortals(this.ms, mapData.portal);
    this.bounds = new Rectangle(
      Math.min.apply(null, this.Footholds.map(x => x.rect.x1)),
      Math.min.apply(null, this.Footholds.map(x => x.rect.y1)),
      Math.max.apply(null, this.Footholds.map(x => x.rect.x2)),
      Math.max.apply(null, this.Footholds.map(x => x.rect.y2))
    );

    this.ms.player.moveToPortal(this.targetPortal);
    this.ms.camera.moveToPlayer();


    //for (var key in mapData.back) {
    //  var item = mapData.back[key];
    //  var back = BackgroundTile.LoadBackground(this.ms, item, parseInt(key));
    //  this.Backgrounds.push(back);
    //}
    //this.Backgrounds.sort((a, b) => a.z - b.z);


    if (!this.ms.isDebug)
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

    this.LayeredTiles.sort((a, b) => (a.layer * 1000 + a.z) - (b.layer * 1000 + b.z));

    this.mapLoadingEvent.trigger(mapData);

    window.setTimeout(() => {
      this.ms.map.loaded = true;
      this.ms.map.mapLoadedEvent.trigger();
    }, 500);
  }

  update() { }
  draw() {
    for (var i = 0; i < this.Backgrounds.length; i++)
      this.Backgrounds[i].draw(this.ms.game.ctx);

    for (var i = 0; i < this.LayeredTiles.length; i++)
      this.LayeredTiles[i].draw(this.ms.game.ctx);

    this.ms.player.draw();

    if (this.ms.isDebug) {
      for (var i = 0; i < this.Footholds.length; i++)
        this.Footholds[i].draw(this.ms.game.ctx);
    }


    this.ms.game.ctx.beginPath();
    for (var i = 0; i < this.portals.length; i++)
      this.portals[i].draw(this.ms.game.ctx);
  }
}

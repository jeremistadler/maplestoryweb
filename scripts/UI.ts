class UI {
    private minimap_name = <HTMLParagraphElement>document.getElementById('minimap_name');
    private minimap_img = <HTMLImageElement>document.getElementById('minimap_image');
    private backdrop = <HTMLImageElement>document.getElementById('backdrop');

    constructor(private ms: IEngine){}

    init(){
        this.ms.map.mapUnloadingEvent.on(() => this.mapUnloading());
        this.ms.map.mapLoadedEvent.on(() => this.mapLoaded());
    }

    mapUnloading() {
        this.ms.ui.minimap_name.innerHTML = this.ms.map.name;
        this.ms.ui.backdrop.className = "enabled";
    }

    mapLoaded() {
        this.ms.ui.minimap_name.innerHTML = this.ms.map.name;
        this.ms.ui.minimap_img.src = this.ms.http.baseUrl + this.ms.map.BasePath + 'minimap/canvas.png';
        this.ms.ui.backdrop.className = "";
    }

    update() {

    }
}

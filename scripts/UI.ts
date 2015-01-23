/// <reference path="main.ts" />

class UI {
    private minimap_name = <HTMLParagraphElement>document.getElementById('minimap_name');
    private minimap_img = <HTMLImageElement>document.getElementById('minimap_image');
    private backdrop = <HTMLImageElement>document.getElementById('backdrop');

    init(){
        var instance = this;
        ms.map.mapLoadingEvent.on(instance.mapLoading);
        ms.map.mapLoadedEvent.on(instance.mapLoaded);

        //http.baseUrl + map.BasePath + 'minimap/canvas.png'
    }

    mapLoading() {
        ms.ui.minimap_name.innerHTML = ms.map.name;
        ms.ui.backdrop.className = "enabled";
    }

    mapLoaded() {
        ms.ui.minimap_name.innerHTML = ms.map.name;
        ms.ui.minimap_img.src = ms.http.baseUrl + ms.map.BasePath + 'minimap/canvas.png';
        ms.ui.backdrop.className = "";
    }

    update() {

    }
}
/// <reference path="main.ts" />

class UI {

    init(){
        var instance = this;
        ms.map.mapLoadedEvent.on(instance.mapChanged);

        //http.baseUrl + map.BasePath + 'minimap/canvas.png'
    }

    mapChanged() {
        var nameElm = <HTMLParagraphElement>document.getElementById('map_name');
        nameElm.innerHTML = ms.map.name;

        var imgElm =<HTMLImageElement>document.getElementById('minimap_image');
        imgElm.src = ms.http.baseUrl + ms.map.BasePath + 'minimap/canvas.png';
    }

    update() {

    }
}
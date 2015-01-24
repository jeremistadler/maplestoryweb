/// <reference path="main.ts" />
var UI = (function () {
    function UI() {
        this.minimap_name = document.getElementById('minimap_name');
        this.minimap_img = document.getElementById('minimap_image');
        this.backdrop = document.getElementById('backdrop');
    }
    UI.prototype.init = function () {
        var instance = this;
        ms.map.mapUnloadingEvent.on(instance.mapUnloading);
        ms.map.mapLoadedEvent.on(instance.mapLoaded);
    };
    UI.prototype.mapUnloading = function () {
        ms.ui.minimap_name.innerHTML = ms.map.name;
        ms.ui.backdrop.className = "enabled";
    };
    UI.prototype.mapLoaded = function () {
        ms.ui.minimap_name.innerHTML = ms.map.name;
        ms.ui.minimap_img.src = ms.http.baseUrl + ms.map.BasePath + 'minimap/canvas.png';
        ms.ui.backdrop.className = "";
    };
    UI.prototype.update = function () {
    };
    return UI;
})();

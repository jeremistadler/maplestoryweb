/// <reference path="main.ts" />
var UI = (function () {
    function UI() {
    }
    UI.prototype.init = function () {
        var instance = this;
        ms.map.mapLoadedEvent.on(instance.mapChanged);
        //http.baseUrl + map.BasePath + 'minimap/canvas.png'
    };
    UI.prototype.mapChanged = function () {
        var nameElm = document.getElementById('map_name');
        nameElm.innerHTML = ms.map.name;
        var imgElm = document.getElementById('minimap_image');
        imgElm.src = ms.http.baseUrl + ms.map.BasePath + 'minimap/canvas.png';
    };
    UI.prototype.update = function () {
    };
    return UI;
})();

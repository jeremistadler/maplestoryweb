var UI = (function () {
    function UI(ms) {
        this.ms = ms;
        this.minimap_name = document.getElementById('minimap_name');
        this.minimap_img = document.getElementById('minimap_image');
        this.backdrop = document.getElementById('backdrop');
    }
    UI.prototype.init = function () {
        var _this = this;
        this.ms.map.mapUnloadingEvent.on(function () { return _this.mapUnloading(); });
        this.ms.map.mapLoadedEvent.on(function () { return _this.mapLoaded(); });
    };
    UI.prototype.mapUnloading = function () {
        this.ms.ui.minimap_name.innerHTML = this.ms.map.name;
        this.ms.ui.backdrop.className = "enabled";
    };
    UI.prototype.mapLoaded = function () {
        this.ms.ui.minimap_name.innerHTML = this.ms.map.name;
        this.ms.ui.minimap_img.src = this.ms.http.baseUrl + this.ms.map.BasePath + 'minimap/canvas.png';
        this.ms.ui.backdrop.className = "";
    };
    UI.prototype.update = function () {
    };
    return UI;
})();

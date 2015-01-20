/// <reference path="main.ts" />
var UI = (function () {
    function UI() {
        this.onLogin = new MSEvent();
        this.onLogout = new MSEvent();
    }
    Object.defineProperty(UI.prototype, "LoggedIn", {
        get: function () {
            return this.onLogin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UI.prototype, "LoggedOut", {
        get: function () {
            return this.onLogout;
        },
        enumerable: true,
        configurable: true
    });
    UI.prototype.test = function () {
        this.onLogin.trigger('bob');
        //http.baseUrl + map.BasePath + 'minimap/canvas.png'
    };
    return UI;
})();

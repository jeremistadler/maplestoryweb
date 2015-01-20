/// <reference path="main.ts" />
var MSEvent = (function () {
    function MSEvent() {
        this.handlers = [];
    }
    MSEvent.prototype.on = function (handler) {
        this.handlers.push(handler);
    };
    MSEvent.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    MSEvent.prototype.trigger = function (data) {
        if (this.handlers) {
            this.handlers.slice(0).forEach(function (h) { return h(data); });
        }
    };
    return MSEvent;
})();

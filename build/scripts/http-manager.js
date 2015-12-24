var HttpManagerCachedRequest = (function () {
    function HttpManagerCachedRequest(path, callback) {
        this.path = path;
        this.done = false;
        this.callbacks = [callback];
    }
    return HttpManagerCachedRequest;
})();
var HttpManager = (function () {
    function HttpManager() {
        this.requestCache = {};
        this.dirtyCallbacks = [];
        this.baseUrl = 'http://mapleassets.jeremi.se/';
    }
    HttpManager.prototype.update = function () {
        if (this.dirtyCallbacks.length == 0)
            return;
        for (var i = 0; i < this.dirtyCallbacks.length; i++) {
            var cache = this.dirtyCallbacks[i];
            for (var j = 0; j < cache.callbacks.length; j++)
                cache.callbacks[j](cache.data);
            cache.callbacks.length = 0;
        }
        this.dirtyCallbacks.length = 0;
    };
    HttpManager.prototype.TryAddDirtyRequest = function (req) {
        for (var i = 0; i < this.dirtyCallbacks.length; i++) {
            if (this.dirtyCallbacks[i] === req)
                return;
        }
        this.dirtyCallbacks.push(req);
    };
    HttpManager.prototype.httpGet = function (path, callback) {
        var cached = this.requestCache[path];
        if (cached) {
            cached.callbacks.push(callback);
            if (cached.done)
                this.TryAddDirtyRequest(cached);
            return;
        }
        cached = new HttpManagerCachedRequest(path, callback);
        this.requestCache[path] = cached;
        var httpRequest = new XMLHttpRequest();
        var instance = this;
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    cached.done = true;
                    cached.data = httpRequest.responseText;
                    if (httpRequest.getResponseHeader('content-type') == 'application/json')
                        cached.data = JSON.parse(cached.data);
                    instance.TryAddDirtyRequest(cached);
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    };
    HttpManager.prototype.httpGetAsset = function (path, callback) {
        this.httpGet(this.baseUrl + path, callback);
    };
    HttpManager.prototype.getJsonPropertyForPath = function (path, callback) {
        var imgIndex = path.indexOf('.img');
        if (imgIndex == -1)
            throw 'No .img json found in path';
        var jsonpath = path.substr(0, imgIndex + 4) + '/properties.json';
        this.httpGetAsset(jsonpath, function (response) {
            var propPath = path.substr(imgIndex + 4);
            var parts = propPath.split('/');
            var current = response;
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].length == 0)
                    continue;
                current = current[parts[i]];
                if (current == null)
                    break;
            }
            callback(current);
        });
    };
    return HttpManager;
})();

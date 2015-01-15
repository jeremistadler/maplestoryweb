class HttpManagerCachedRequest {
    public done: boolean = false;
    public data: any;
    public callbacks: Array<(any) => void>;
    constructor(public path: string, callback: (any) => void) {
        this.callbacks = [callback]
    }
}

class HttpManager {
    private requestCache: { [url: string]: HttpManagerCachedRequest } = {};
    private dirtyCallbacks: HttpManagerCachedRequest[] = [];
    public baseUrl: string = 'http://mapleassets.jeremi.se/';

    public update() {
        if (this.dirtyCallbacks.length == 0)
            return;

        for (var i = 0; i < this.dirtyCallbacks.length; i++) {
            var cache = this.dirtyCallbacks[i];
            for (var j = 0; j < cache.callbacks.length; j++)
                cache.callbacks[j](cache.data);

            cache.callbacks.length = 0;
        }

        this.dirtyCallbacks.length = 0;
    }

    private TryAddDirtyRequest(req: HttpManagerCachedRequest): void {
        for (var i = 0; i < this.dirtyCallbacks.length; i++) {
            if (this.dirtyCallbacks[i] === req)
                return;
        }
        this.dirtyCallbacks.push(req);
    }

    public httpGet(path: string, callback: (any) => void): void {
        var cached = this.requestCache[path];
        if (cached) {
            cached.callbacks.push(callback);
            if (cached.done)
                this.TryAddDirtyRequest(cached);
            return;
        }

        cached = new HttpManagerCachedRequest(path, callback)
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
    }

    public httpGetAsset(path: string, callback: (any) => void): void {
        this.httpGet(this.baseUrl + path, callback);
    }

    public getJsonPropertyForPath(path: string, callback): void {
        var imgIndex = path.indexOf('.img');
        if (imgIndex == -1) throw 'No .img json found in path';
        var jsonpath = path.substr(0, imgIndex + 4) + '/properties.json';
        this.httpGetAsset(jsonpath, function (response) {
            var propPath = path.substr(imgIndex + 4);
            var parts = propPath.split('/');
            var current = response;
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].length == 0) continue;
                current = current[parts[i]];
                if (current == null) break;
            }
            callback(current);
        });
    }
}




var Networking = (function () {
    function Networking(ms) {
        this.ms = ms;
        this.Players = {};
        this.nextFrameDate = 0;
        this.allowSending = false;
        this.lastXPos = 0;
        this.lastYPos = 0;
    }
    Networking.prototype.init = function () {
        var _this = this;
        if (this.ms.isDebug)
            this.socket = io('http://localhost:3000', { 'transports': ['websocket', 'polling'] });
        else
            this.socket = io('http://maplestoryserver.jeremi.se:3000', { 'transports': ['websocket', 'polling'] });
        this.socket.on('connect', function () { return _this.connected(); });
        this.socket.on('playerState', function (data) { return _this.onStateRecived(data); });
        this.socket.on('players', function (data) { return _this.onPlayersRecived(data); });
        this.socket.on('playerInfo', function (data) { return _this.onMyInfoRecived(data); });
        this.socket.on('disconnect', function () { return _this.disconnected(); });
        this.animator = new CharacterAnimator(this.ms, 'Character/00002000.img', ['walk1', 'walk2', 'jump', 'stand1', 'stand2']);
        this.ms.map.mapLoadedEvent.on(function () { return _this.onLoadedNewMap(); });
    };
    Networking.prototype.makeToken = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 6; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };
    Networking.prototype.onStateRecived = function (state) {
        if (state.id != this.clientId)
            this.Players[state.id] = state;
    };
    Networking.prototype.onPlayersRecived = function (players) {
        var _this = this;
        console.log('Received map players: ', players);
        var lookup = {};
        players.forEach(function (f) { return lookup[f.id] = _this.Players[f.id] || f; });
        this.Players = lookup;
    };
    Networking.prototype.onMyInfoRecived = function (info) {
        this.clientId = info.id;
        console.log('Authenticated!', info);
        this.socket.emit('joinMap', { mapId: this.ms.map.Id.toString() });
        this.allowSending = true;
    };
    Networking.prototype.connected = function () {
        console.log('Connected!');
        var token = window.localStorage.getItem('authToken');
        if (!token || true) {
            token = this.makeToken();
            window.localStorage.setItem('authToken', token);
        }
        this.socket.emit('auth', { token: token });
    };
    Networking.prototype.disconnected = function () {
        console.log('Disconnected!');
    };
    Networking.prototype.onLoadedNewMap = function () {
        this.socket.emit('joinMap', { mapId: this.ms.map.Id.toString() });
    };
    Networking.prototype.update = function () {
        if (new Date().getTime() > this.nextFrameDate &&
            this.allowSending &&
            (this.lastXPos != this.ms.player.Position.x ||
                this.lastYPos != this.ms.player.Position.y ||
                new Date().getTime() > this.nextFrameDate + 1000)) {
            this.socket.emit('playerState', {
                id: this.clientId,
                x: this.ms.player.Position.x,
                y: this.ms.player.Position.y,
                vX: this.ms.player.Velocity.x,
                vY: this.ms.player.Velocity.y,
                isInAir: this.ms.player.isInAir,
                flipped: this.ms.player.flipped,
                mapId: this.ms.map.Id.toString()
            });
            this.nextFrameDate = new Date().getTime() + 100;
            this.lastXPos = this.ms.player.Position.x;
            this.lastYPos = this.ms.player.Position.y;
        }
        for (var id in this.Players) {
            var player = this.Players[id];
            player.x += player.vX * this.ms.game.frameTime * 0.05;
            player.y += player.vY * this.ms.game.frameTime * 0.05;
        }
    };
    Networking.prototype.draw = function () {
        for (var id in this.Players) {
            var p = this.Players[id];
            if (p.isInAir || p.vY > 0)
                this.animator.draw(this.ms.game.ctx, p.x, p.y, p.flipped, 'jump', this.ms.game.frameTime);
            else if (p.vX != 0)
                this.animator.draw(this.ms.game.ctx, p.x, p.y, p.flipped, 'walk1', this.ms.game.frameTime * Math.abs(p.vX / 3));
            else
                this.animator.draw(this.ms.game.ctx, p.x, p.y, p.flipped, 'stand1', this.ms.game.frameTime);
        }
    };
    return Networking;
})();

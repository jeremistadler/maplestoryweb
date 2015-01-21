/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="world.ts" />
/// <reference path="vector.ts" />
/// <reference path="player.ts" />
/// <reference path="texture.ts" />
/// <reference path="foothold.ts" />
/// <reference path="camera.ts" />
/// <reference path="portal.ts" />
/// <reference path="UI.ts" />
/// <reference path="http-manager.ts" />
/// <reference path="tiles/static-tile.ts" />
/// <reference path="tiles/background-tile.ts" />
/// <reference path="tiles/animated-tile.ts" />
var Game = (function () {
    function Game() {
    }
    Game.prototype.init = function () {
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.ctx.font = '12px Segoe UI';
        this.totalGameTime = Date.now();
        this.lastGameTime = this.totalGameTime - 20;
        this.frameTime = 20;
    };
    Game.prototype.resize = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    Game.prototype.update = function () {
        ms.http.update();
        this.lastGameTime = this.totalGameTime;
        this.totalGameTime = Date.now();
        this.frameTime = this.totalGameTime - this.lastGameTime;
        ms.camera.update();
        ms.map.update();
        ms.player.update();
        ms.ui.update();
    };
    Game.prototype.draw = function () {
        ms.camera.reset();
        this.ctx.fillStyle = 'rgb(100, 149, 237)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ms.camera.draw();
        ms.map.draw();
        ms.player.draw();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(this.canvas.width / 2, 100);
        this.ctx.scale(0.1, 0.1);
        ms.map.draw();
    };
    return Game;
})();
var Engine = (function () {
    function Engine() {
        this.game = new Game();
        this.camera = new Camera();
        this.map = new World();
        this.player = new Player();
        this.http = new HttpManager();
        this.ui = new UI();
    }
    Engine.prototype.run = function () {
        this.game.init();
        this.camera.init();
        this.player.init();
        this.ui.init();
        this.map.loadMap(100000000, null);
        $(window).resize(function () {
            ms.game.resize();
        });
        function gotAnimationFrame() {
            requestAnimationFrame(gotAnimationFrame);
            ms.game.update();
            ms.game.draw();
        }
        gotAnimationFrame();
    };
    return Engine;
})();
var ms = new Engine();
ms.run();

/// <reference path="libs/jquery/jquery.d.ts" />
/// <reference path="libs/angular/angular.d.ts" />
/// <reference path="world.ts" />
/// <reference path="vector.ts" />
/// <reference path="player.ts" />
/// <reference path="texture.ts" />
/// <reference path="foothold.ts" />
/// <reference path="camera.ts" />
/// <reference path="portal.ts" />
/// <reference path="http-manager.ts" />
/// <reference path="tiles/static-tile.ts" />
/// <reference path="tiles/background-tile.ts" />
/// <reference path="tiles/animated-tile.ts" />
// http://fc09.deviantart.net/fs25/f/2008/086/e/e/Render__Henesys_by_iChicken.png
var Game = (function () {
    function Game() {
    }
    Game.prototype.init = function () {
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.totalGameTime = Date.now();
        this.lastGameTime = this.totalGameTime - 20;
        this.frameTime = 20;
    };
    Game.prototype.resize = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    Game.prototype.update = function () {
        http.update();
        this.lastGameTime = this.totalGameTime;
        this.totalGameTime = Date.now();
        this.frameTime = this.totalGameTime - this.lastGameTime;
        camera.update();
        map.update();
        player.update();
    };
    Game.prototype.draw = function () {
        camera.reset();
        this.ctx.fillStyle = 'rgb(100, 149, 237)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        camera.draw();
        map.draw();
        player.draw();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(0.1, 0.1);
        this.ctx.translate(-100, 0);
        map.draw();
    };
    return Game;
})();
var game = new Game();
var camera = new Camera();
var map = new World();
var player = new Player();
var http = new HttpManager();
game.init();
camera.init();
player.init();
map.init('100000200');
$(window).resize(function () {
    game.resize();
});
function gotAnimationFrame() {
    requestAnimationFrame(gotAnimationFrame);
    game.update();
    game.draw();
}
gotAnimationFrame();
angular.module('maplestory', []).controller('minimap', function ($scope) {
    $scope.map = {
        name: 'Henesys',
        minimap: {
            background: http.baseUrl + map.BasePath + 'minimap/canvas.png'
        }
    };
});

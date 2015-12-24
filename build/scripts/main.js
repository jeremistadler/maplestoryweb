var Game = (function () {
    function Game(ms) {
        this.ms = ms;
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
        this.ms.http.update();
        this.lastGameTime = this.totalGameTime;
        this.totalGameTime = Date.now();
        this.frameTime = this.totalGameTime - this.lastGameTime;
        this.ms.camera.update();
        this.ms.map.update();
        this.ms.player.update();
        this.ms.ui.update();
    };
    Game.prototype.draw = function () {
        if (!this.ms.map.loaded)
            return;
        this.ms.camera.reset();
        this.ctx.fillStyle = 'cornflowerblue';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ms.camera.draw();
        this.ms.map.draw();
        this.ms.player.draw();
        //// Draw everything shrinked for debug
        //this.ctx.translate(this.ms.camera.boundsLeft + 400, this.ms.camera.boundsTop + 400);
        //this.ctx.scale(0.1, 0.1);
        //    this.ms.map.draw();
        //    this.ms.player.draw();
        //this.ctx.strokeStyle = "red";
        //this.ctx.lineWidth = 10;
        //this.ctx.strokeRect(this.ms.camera.boundsLeft, this.ms.camera.boundsTop, this.ms.camera.width, this.ms.camera.height);
        //this.ctx.lineWidth = 1;
        this.ms.fps.draw(this.ctx);
    };
    return Game;
})();
var Engine = (function () {
    function Engine() {
        this.game = new Game(this);
        this.camera = new Camera(this);
        this.map = new World(this);
        this.player = new Player(this);
        this.http = new HttpManager();
        this.ui = new UI(this);
        this.sound = new SoundPlayer(this);
        this.fps = new Fps(this);
        this.isDebug = window.location.hostname == 'localhost';
    }
    Engine.prototype.gotAnimationFrame = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.gotAnimationFrame(); });
        this.game.update();
        this.game.draw();
    };
    Engine.prototype.run = function () {
        var _this = this;
        this.game.init();
        this.camera.init();
        this.player.init();
        this.ui.init();
        this.sound.init();
        //this.map.loadMap(101000000, null); // elina
        this.map.loadMap(100000000, null); // henesys
        window.addEventListener('resize', function () { return _this.game.resize(); }, false);
        this.gotAnimationFrame();
    };
    return Engine;
})();
new Engine().run();

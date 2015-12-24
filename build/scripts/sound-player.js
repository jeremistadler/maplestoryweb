var SoundPlayer = (function () {
    function SoundPlayer(ms) {
        this.ms = ms;
    }
    SoundPlayer.prototype.init = function () {
        var _this = this;
        this.ms.map.mapLoadingEvent.on(function (mapData) { return _this.mapLoading(mapData); });
        this.ms.map.mapUnloadingEvent.on(function () { return _this.mapUnloaded(); });
    };
    SoundPlayer.prototype.mapLoading = function (mapData) {
        var soundPath = mapData.info.bgm;
        soundPath = this.ms.http.baseUrl + "Sound/" + soundPath.replace("/", ".img/") + ".mp3";
        if (soundPath == this.ms.sound.backgroundMusicPath) {
            return;
        }
        if (this.ms.sound.backgroundMusic)
            this.ms.sound.backgroundMusic.pause();
        this.ms.sound.backgroundMusicPath = soundPath;
        this.ms.sound.backgroundMusic = new Audio(soundPath);
        this.ms.sound.backgroundMusic.loop = true;
        this.ms.sound.backgroundMusic.volume = 0.2;
        if (!this.ms.isDebug)
            this.ms.sound.backgroundMusic.play();
    };
    SoundPlayer.prototype.mapUnloaded = function () {
    };
    SoundPlayer.prototype.playSound = function (path) {
        path = this.ms.http.baseUrl + "Sound/" + path + ".mp3";
        var sound = new Audio(path);
        sound.volume = 0.2;
        sound.play();
    };
    return SoundPlayer;
})();

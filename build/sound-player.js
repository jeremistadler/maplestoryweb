/// <reference path="main.ts" />
var SoundPlayer = (function () {
    function SoundPlayer() {
    }
    SoundPlayer.prototype.init = function () {
        var instance = this;
        ms.map.mapLoadingEvent.on(instance.mapLoading);
        ms.map.mapUnloadingEvent.on(instance.mapUnloaded);
    };
    SoundPlayer.prototype.mapLoading = function (mapData) {
        var soundPath = mapData.info.bgm;
        soundPath = ms.http.baseUrl + "Sound/" + soundPath.replace("/", ".img/") + ".mp3";
        if (soundPath == ms.sound.backgroundMusicPath) {
            return;
        }
        if (ms.sound.backgroundMusic)
            ms.sound.backgroundMusic.pause();
        ms.sound.backgroundMusicPath = soundPath;
        ms.sound.backgroundMusic = new Audio(soundPath);
        ms.sound.backgroundMusic.loop = true;
        ms.sound.backgroundMusic.volume = 0.2;
        ms.sound.backgroundMusic.play();
    };
    SoundPlayer.prototype.mapUnloaded = function () {
    };
    SoundPlayer.prototype.playSound = function (path) {
        path = ms.http.baseUrl + "Sound/" + path + ".mp3";
        var sound = new Audio(path);
        sound.volume = 0.2;
        sound.play();
    };
    return SoundPlayer;
})();

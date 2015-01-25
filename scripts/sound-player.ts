/// <reference path="main.ts" />


class SoundPlayer
{
    backgroundMusic: HTMLAudioElement;
    backgroundMusicPath: string;

    init() {
        var instance = this;
        ms.map.mapLoadingEvent.on(instance.mapLoading);
        ms.map.mapUnloadingEvent.on(instance.mapUnloaded);
    }

    mapLoading(mapData) {
        var soundPath = <string>mapData.info.bgm;
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
        //ms.sound.backgroundMusic.play();
    }

    mapUnloaded() {
    }

    playSound(path) {
        path = ms.http.baseUrl + "Sound/" + path + ".mp3";

        var sound = new Audio(path);
        sound.volume = 0.2;
        sound.play();
    }
}
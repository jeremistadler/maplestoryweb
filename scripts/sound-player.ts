class SoundPlayer
{
    backgroundMusic: HTMLAudioElement;
    backgroundMusicPath: string;

    constructor(private ms: IEngine){}

    init() {
        this.ms.map.mapLoadingEvent.on((mapData: any) => this.mapLoading(mapData));
        this.ms.map.mapUnloadingEvent.on(() => this.mapUnloaded());
    }

    mapLoading(mapData: any) {
        var soundPath = <string>mapData.info.bgm;
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
    }

    mapUnloaded() {
    }

    playSound(path: string) {
        path = this.ms.http.baseUrl + "Sound/" + path + ".mp3";

        var sound = new Audio(path);
        sound.volume = 0.2;
        sound.play();
    }
}

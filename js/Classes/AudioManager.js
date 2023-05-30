export class AudioManager {
    constructor() {
        this.music = this.createAudio("../sound/music.mp3", 0.6);
        this.jumpSound = this.createAudio("../sound/jump.mp3", 0.5);
        this.hitSound = this.createAudio("../sound/hit.mp3", 1);
        this.pickupSound = this.createAudio("../sound/pickup.mp3", 1);
        this.senzuSound = this.createAudio("../sound/senzu.mp3", 1);
        this.transformSound = this.createAudio("../sound/transform.mp3", 0.5);
        this.winSound = this.createAudio("../sound/win.mp3", 0.7);
        this.loseSound = this.createAudio("../sound/lose.mp3", 0.7);
    }


    createAudio(source, volume) {
        const AUDIO = new Audio();
        AUDIO.src = source;
        AUDIO.volume = volume;

        return AUDIO;
    }
}
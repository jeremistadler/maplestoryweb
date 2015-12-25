
class CharacterAnimationFrame {
  public id: number;
  public tex: Texture;
  public frameLength: number;
  public originalFrameLength: number;
  public offset: Vector;
  public z: string;
  public maps: { [name: string]: Vector } = {};

  constructor(private ms: IEngine, data, id, path, defaultDelay) {
    this.frameLength = data.delay || defaultDelay;
    this.originalFrameLength = defaultDelay;
    this.tex = new Texture(ms, ms.http.baseUrl + path + '.png');
    this.offset = new Vector(data.origin.x, data.origin.y);
    this.id = id;
    this.z = data.z;

    for (var key in data.map) {
      var map = data.map[key];
      this.maps[key] = new Vector(map.x, map.y);
    }
  }
}

class CharacterPart {
  timeToNextFrame: number = 0;
  currentFrame: number = 0;
  isGoingBackwards: boolean = false;
  public frames: CharacterAnimationFrame[] = [];

  draw(frameTime: number, ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean) {
    if (this.frames.length == 0) return;

    this.timeToNextFrame -= frameTime;
    while (this.timeToNextFrame < 0) {

      if ((this.currentFrame == 0 && this.isGoingBackwards) ||
          (this.currentFrame == this.frames.length - 1 && !this.isGoingBackwards))
          this.isGoingBackwards = !this.isGoingBackwards;

      this.currentFrame += this.isGoingBackwards ? -1 : 1;
      this.currentFrame = Math.max(0, Math.min(this.currentFrame, this.frames.length - 1));
      this.timeToNextFrame += this.frames[this.currentFrame].frameLength;
    }

    var frame = this.frames[this.currentFrame];
    var topLeftX = x - frame.offset.x;
    var topLeftY = y - frame.offset.y;

    if (frame.z == "arm") {
        topLeftX += 6 + frame.maps["hand"].x;
        topLeftY -= 15 + frame.maps["hand"].y;
    }

    frame.tex.draw(ctx, topLeftX, topLeftY, flip);
  }
}

class CharacterAnimation {
  parts: CharacterPart[] = [];
  loaded: boolean = false;

  draw(frameTime: number, ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean) {
    if (!this.loaded) return;

    for (var i = 0; i < this.parts.length; i++)
      this.parts[i].draw(frameTime, ctx, x, y, flip);
  }
}

class CharacterAnimator {
  loaded: boolean = false;
  animations: { [name: string]: CharacterAnimation } = {};

  constructor(private ms: IEngine, path: string, animationNames: string[]) {
    for (var i = 0; i < animationNames.length; i++)
      this.loadAnimation(path, animationNames[i]);
  }

  loadAnimation(basePath: string, animationName: string) {
    var body = new CharacterPart();
    var arm = new CharacterPart();
    var animation = new CharacterAnimation();
    animation.parts.push(body);
    animation.parts.push(arm);
    this.animations[animationName] = animation;

    this.ms.http.getJsonPropertyForPath(basePath + '/' + animationName, (data) => {
      for (var key in data) {
        var id = parseInt(key);
        
        if (isNaN(id))
          continue;

        body.frames.push(new CharacterAnimationFrame(this.ms, data[key].body, id, basePath + '/' + animationName + "/" + key + "/body", data[key].delay));
        arm.frames.push(new CharacterAnimationFrame(this.ms, data[key].arm, id, basePath + '/' + animationName + "/" + key + "/arm", data[key].delay));
      }

      body.frames.sort((a, b) => b.id - a.id);
      arm.frames.sort((a, b) => b.id - a.id);

      animation.loaded = true;
    });
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean, animationName: string, frameTime: number) {
      this.animations[animationName].draw(frameTime, ctx, x, y, flip);
  }
}

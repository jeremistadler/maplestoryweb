
class CharacterAnimationFrame {
  public id: number;
  public tex: Texture;
  public frameLength: number;
  public originalFrameLength: number;
  public offset: Vector;
  public z: string;
  public maps: { [name: string]: Vector } = {};

  constructor(private ms: IEngine, data, id, path, defaultDelay) {
    this.frameLength = data.delay || defaultDelay || 300;
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

    var bodyMap = {
      neck: { x: 0, y: -30 },
      hand: { x: 10, y: -15 },
      navel: { x: 0, y: 5 }
    }

    var bodypartMap = {
      arm: { x: 0, y: -30 },
      body: { x: 10, y: -15 },
      head: { x: 0, y: 5 }
    }

    var aa = bodypartMap[frame.z];
    if (!aa) debugger;

    topLeftX += aa.x;
    topLeftY += aa.y;

    frame.tex.draw(ctx, topLeftX, topLeftY, flip);
  }
}

class CharacterAnimation {
  parts: CharacterPart[] = [];
  loaded: boolean = false;

  constructor(public name: string){}

  draw(frameTime: number, ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean) {
    if (!this.loaded) return;

    for (var i = 0; i < this.parts.length; i++)
      this.parts[i].draw(frameTime, ctx, x, y, flip);
  }
}

class CharacterAnimator {
  loaded: boolean = false;
  animations: { [name: string]: CharacterAnimation } = {};

  constructor(private ms: IEngine, paths: string[], animationNames: string[]) {
    for (var i = 0; i < animationNames.length; i++){
      var animation = new CharacterAnimation(animationNames[i]);
      this.animations[animationNames[i]] = animation;

      for (let q = 0; q < paths.length; q++) {
        this.loadAnimation(paths[q], animationNames[i]);
      }
    }
  }

  loadAnimation(basePath: string, animationName: string) {
    this.ms.http.getJsonPropertyForPath(basePath + '/' + animationName, (data) => {
      var partLookup = {};
      var animation = this.animations[animationName];
      for (var key in data) {
        var id = parseInt(key);

        if (isNaN(id))
          continue;

        for (var partName in data[key]) {
          if (typeof data[key][partName] !== 'object') continue;
          var part = partLookup[partName];
          if (!part){
            part = new CharacterPart();
            partLookup[partName] = part;
            animation.parts.push(part);
          }
          part.frames.push(new CharacterAnimationFrame(this.ms, data[key][partName], id, basePath + '/' + animationName + "/" + key + "/" + partName, data[key].delay));
        }
      }

      for (let i = 0; i < animation.parts.length; i++)
        animation.parts[i].frames.sort((a, b) => b.id - a.id);

      animation.loaded = true;
    });
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean, animationName: string, frameTime: number) {
      this.animations[animationName].draw(frameTime, ctx, x, y, flip);
  }
}

import { Graphic } from "./Graphic.js";
import { Input } from "./Input.js";
import { Queue } from "./Queue.js";
import { Sound } from "./Sound.js";
import { State } from "./State.js";

export class Console {
  static config;
  static playing;
  static intervalId;

  static async setup(params) {
    this.config = (await import("../../../config/console.js")).default;

    Input.setup();
    Queue.setup();
    await Sound.setup(params);
    await Graphic.setup(params);

    await State.setup(params);

    this.playing = false;
    document.getElementById("screen").onclick = () => {
      if (!this.playing) {
        this.start();
      } else {
        this.pause();
      }
    };
  }

  static start() {
    if (!Sound.audioContext) {
      Sound.initialize();
    }
    this.intervalId = setInterval(() => {
      Queue.onFrame();
      State.stack.slice(-1)[0].onFrame();
    }, 1000 / this.config.fps);
    document.getElementById("start").style.display = "none";
    this.playing = true;
  }

  static pause() {
    Sound.stop();
    clearInterval(this.intervalId);
    document.getElementById("start").style.display = "block";
    this.playing = false;
  }
}

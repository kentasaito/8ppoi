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
    const cartridgePath = "../../../cartridges/" + params.cartridge.author +
      "/" +
      params.cartridge.name + "/" +
      params.cartridge.version;

    Input.setup();
    Queue.setup();
    Sound.setup({
      config: (await import(cartridgePath + "/src/sound.js")).default,
    });
    Graphic.setup({
      config: (await import(cartridgePath + "/src/graphic.js")).default,
    });
    State.setup({
      config: (await import(cartridgePath + "/src/state.js")).default,
    });
    this.playing = false;
  }

  static start() {
    if (!Sound.audioContext) {
      Sound.initialize();
    }
    this.intervalId = setInterval(() => {
      Queue.onFrame();
      State.stack.slice(-1)[0].onFrame();
      Input.onFrame();
    }, 1000 / 60);
    this.playing = true;
  }

  static pause() {
    Sound.stop();
    clearInterval(this.intervalId);
    this.playing = false;
  }
}

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
    {
      const config = (await import(
        "../../../cartridges/" + params.cartridge.author + "/" +
          params.cartridge.name + "/" +
          params.cartridge.version + "/config/sound.js"
      )).default;
      Sound.setup({ config });
    }
    {
      const config = (await import(
        "../../../cartridges/" + params.cartridge.author + "/" +
          params.cartridge.name + "/" +
          params.cartridge.version + "/config/graphic.js"
      )).default;
      Graphic.setup({ config });
    }
    {
      const config = (await import(
        "../../../cartridges/" + params.cartridge.author + "/" +
          params.cartridge.name + "/" +
          params.cartridge.version + "/config/state.js"
      )).default;
      const states = [];
      for (const stateName of config.stateNames) {
        states[stateName] = (await import(
          "../../../cartridges/" + params.cartridge.author + "/" +
            params.cartridge.name + "/" +
            params.cartridge.version + "/states/" + stateName + ".js"
        ))[stateName];
      }
      State.setup({ config, states });
    }

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

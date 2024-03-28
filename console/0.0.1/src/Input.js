import { Pad } from "./instance/Pad.js";
import { Console } from "./Console.js";

export class Input {
  static pads;

  static setup() {
    this.pads = [];
    for (const padId of [0, 1]) {
      this.pads[padId] = new Pad({ padId });
    }

    for (const key of ["onkeydown", "onkeyup"]) {
      globalThis[key] = (event) => {
        if (!Console.playing) {
          Console.start();
        }
        for (const padId of Object.keys(this.pads)) {
          for (const groupName of Object.keys(this.pads[padId].statuses)) {
            for (
              const buttonName of Object.keys(
                this.pads[padId].statuses[groupName],
              )
            ) {
              if (
                event.key === this.pads[padId].keys[groupName][buttonName] &&
                !event.repeat
              ) {
                this.pads[padId].statuses[groupName][buttonName] =
                  key === "onkeydown";
              }
            }
          }
        }
      };
    }
  }
}

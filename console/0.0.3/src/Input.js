import { Diamond } from "./instance/Diamond.js";
import { Pad } from "./instance/Pad.js";
import { Console } from "./Console.js";

export class Input {
  static pads;

  static setup() {
    this.pads = [];
    for (const padId of [0]) {
      this.pads[padId] = new Pad({ padId });
    }

    for (const key of ["onkeydown", "onkeyup"]) {
      globalThis[key] = (event) => {
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
                this.pads[padId].statuses[groupName][buttonName] = (key === "onkeydown") * 3;
              }
            }
          }
        }
      };
    }

    if ("ontouchstart" in globalThis) {
      document.getElementById("pad").style.display = "flex";
      new Diamond({
        parent: document.querySelectorAll("#pad .diamond")[0],
        statuses: this.pads[0].statuses["directions"],
      });
      new Diamond({
        parent: document.querySelectorAll("#pad .diamond")[1],
        statuses: this.pads[0].statuses["actions"],
      });
    }
  }

  static onFrame() {
    for (const padId of Object.keys(this.pads)) {
      for (const groupName of Object.keys(this.pads[padId].statuses)) {
        for (
          const buttonName of Object.keys(
            this.pads[padId].statuses[groupName],
          )
        ) {
          this.pads[padId].statuses[groupName][buttonName] &= 1;
        }
      }
    }
  }
}

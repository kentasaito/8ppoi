import { Diamond } from "./instance/Diamond.js";

export class Input {
  static keys;
  static statuses;
  static lastStatuses;

  static setup() {
    this.keys = [
      {
        directions: {
          right: "ArrowRight",
          up: "ArrowUp",
          left: "ArrowLeft",
          down: "ArrowDown",
        },
        actions: {
          right: "c",
          up: "s",
          left: "z",
          down: "x",
        },
      },
    ];

    this.statuses = [
      {
        directions: {
          right: 0,
          up: 0,
          left: 0,
          down: 0,
        },
        actions: {
          right: 0,
          up: 0,
          left: 0,
          down: 0,
        },
      },
    ];
    this.lastStatuses = structuredClone(this.statuses[0]);

    new Diamond({
      element: document.querySelectorAll(".diamond")[0],
      statuses: this.statuses[0].directions,
    });
    new Diamond({
      element: document.querySelectorAll(".diamond")[1],
      statuses: this.statuses[0].actions,
    });

    for (const type of ["onkeydown", "onkeyup"]) {
      document[type] = (event) => {
        for (const groupName in this.statuses[0]) {
          for (const buttonName in this.statuses[0][groupName]) {
            if (event.key === this.keys[0][groupName][buttonName]) {
              this.statuses[0][groupName][buttonName] = type === "onkeydown"
                ? 1
                : 0;
            }
          }
        }
      };
    }
  }

  static onFrame() {
    for (const groupName in this.statuses[0]) {
      for (const buttonName in this.statuses[0][groupName]) {
        this.statuses[0][groupName][buttonName] &= ~2;
        this.statuses[0][groupName][buttonName] |=
          ((this.lastStatuses[groupName][buttonName] & 1) === 0 &&
            (this.statuses[0][groupName][buttonName] & 1) === 1) * 2;
        this.statuses[0][groupName][buttonName] &= ~4;
        this.statuses[0][groupName][buttonName] |=
          ((this.lastStatuses[groupName][buttonName] & 1) === 1 &&
            (this.statuses[0][groupName][buttonName] & 1) === 0) * 4;
        this.lastStatuses[groupName][buttonName] =
          this.statuses[0][groupName][buttonName];
      }
    }
  }
}

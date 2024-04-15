import { Graphic, Input, Queue, Sound } from "../deps.js";

export class Index {
  static pitElements;
  static _pits;
  static pits;
  static cursorElements;
  static _turn;
  static _cursors;
  static playerIndex;
  static cursors;

  static onPush() {
    this.start();
  }

  static onPop() {
    this.start();
  }

  static start() {
    this.delay = 40;
    this.pitElements = [];
    this._pits = [];
    this.pits = [];
    for (let pitIndex = 0; pitIndex < 14; pitIndex++) {
      const y = 20 * (pitIndex % 7 === 0 ? 2 : pitIndex < 7 ? 3 : 1) + 16;
      this.pitElements[pitIndex] = Graphic.newLabel({
        fontName: "English",
        params: { y: y, visible: true },
      });
      Object.defineProperty(this.pits, pitIndex, {
        get: () => this._pits[pitIndex],
        set: (value) => {
          this._pits[pitIndex] = value;
          this.pitElements[pitIndex].x =
            (pitIndex < 7 ? 7 - pitIndex : pitIndex - 7) * 20 +
            (this._pits[pitIndex] < 10 ? 6 : 2);
          this.pitElements[pitIndex].text = this._pits[pitIndex];
        },
      });
      this.pits[pitIndex] = pitIndex % 7 === 0 ? 0 : 4;
    }

    Object.defineProperty(this, "playerIndex", {
      get: () => this._playerIndex,
      set: (value) => {
        this._playerIndex = value;
        for (const playerIndex of [0, 1]) {
          this.cursorElements[playerIndex].visible =
            playerIndex === this._playerIndex;
        }
      },
    });

    this.cursorElements = [];
    this._cursors = [];
    this.cursors = [];
    for (const playerIndex of [0, 1]) {
      this.cursorElements[playerIndex] = Graphic.newSprite({
        spriteName: "Cursor",
        params: { visible: true },
      });
      Object.defineProperty(this.cursors, playerIndex, {
        get: () => this._cursors[playerIndex],
        set: (value) => {
          this._cursors[playerIndex] = value;
          this.cursorElements[playerIndex].x = (this._cursors[playerIndex] < 7
                ? 7 - this._cursors[playerIndex]
                : this._cursors[playerIndex] - 7) * 20 + 6;
          this.cursorElements[playerIndex].y =
            20 * (this._cursors[playerIndex] % 7 === 0
                ? 2
                : this._cursors[playerIndex] < 7
                ? 3
                : 1) + 16 + 9;
        },
      });
    }

    this.playerIndex = 0;
    this.cursors[0] = 1;
    this.cursors[1] = 8;
  }

  static onFrame() {
    for (const buttonName of ["left", "right"]) {
      const d = this.playerIndex === 0 ^ buttonName === "right" ? 1 : -1;
      if (Input.pads[0].statuses.directions[buttonName]) {
        Input.pads[0].statuses.directions[buttonName] = false;
        if (
          this.cursors[this.playerIndex] + d > 7 * this.playerIndex + 0 &&
          this.cursors[this.playerIndex] + d < 7 * this.playerIndex + 7
        ) {
          this.cursors[this.playerIndex] += d;
        }
      }
    }
    if (Input.pads[0].statuses.actions.negative) {
      Input.pads[0].statuses.actions.negative = false;
      if (this.pits[this.cursors[this.playerIndex]] > 0) {
        this.sow();
      }
    }
  }

  static sow() {
    const steps = [];

    let pitIndex;
    let hand;

    steps.push({
      func: () => {
        pitIndex = this.cursors[this.playerIndex];
        hand = this.pits[pitIndex];
        this.pitElements[pitIndex].y -= 4;
        this.pitElements[pitIndex].colorIndex = 2;
        while (hand) {
          pitIndex = (pitIndex + 13) % 14;
          if (pitIndex === 7 - this.playerIndex * 7) {
            pitIndex = (pitIndex + 13) % 14;
          }
          hand--;
          this.pitElements[pitIndex].y -= 4;
          this.pitElements[pitIndex].colorIndex = 2;
        }
        Sound.play({ scoreName: "Pickup" });
      },
      delay: 0,
    });

    steps.push({
      func: () => {
        pitIndex = this.cursors[this.playerIndex];
        hand = this.pits[pitIndex];
        this.pits[pitIndex] = 0;
        this.pitElements[pitIndex].y += 4;
        this.pitElements[pitIndex].colorIndex = 1;
        while (hand) {
          pitIndex = (pitIndex + 13) % 14;
          if (pitIndex === 7 - this.playerIndex * 7) {
            pitIndex = (pitIndex + 13) % 14;
          }
          hand--;
          this.pitElements[pitIndex].y += 4;
          this.pitElements[pitIndex].colorIndex = 1;
          this.pits[pitIndex]++;
        }
        Sound.play({ scoreName: "Put" });
      },
      delay: this.delay,
    });
    steps.push({
      func: () => {
        if (
          pitIndex % 7 !== 0 && Math.floor(pitIndex / 7) === this.playerIndex &&
          this.pits[pitIndex] === 1 && this.pits[14 - pitIndex] > 0
        ) {
          steps.push({
            func: () => {
              this.pitElements[14 - pitIndex].y -= 4;
              this.pitElements[14 - pitIndex].colorIndex = 2;
              this.pitElements[this.playerIndex * 7].y -= 4;
              this.pitElements[this.playerIndex * 7].colorIndex = 2;
              Sound.play({ scoreName: "Pickup" });
            },
            delay: this.delay,
          });
          steps.push({
            func: () => {
              this.pitElements[14 - pitIndex].y += 4;
              this.pitElements[14 - pitIndex].colorIndex = 1;
              this.pitElements[this.playerIndex * 7].y += 4;
              this.pitElements[this.playerIndex * 7].colorIndex = 1;
              hand = this.pits[14 - pitIndex];
              this.pits[14 - pitIndex] = 0;
              this.pits[this.playerIndex * 7] += hand;
              Sound.play({ scoreName: "Put" });
            },
            delay: this.delay,
          });
          steps.push({
            func: () => {
              this.pitElements[pitIndex].y -= 4;
              this.pitElements[pitIndex].colorIndex = 2;
              this.pitElements[this.playerIndex * 7].y -= 4;
              this.pitElements[this.playerIndex * 7].colorIndex = 2;
              Sound.play({ scoreName: "Pickup" });
            },
            delay: this.delay,
          });
          steps.push({
            func: () => {
              this.pitElements[pitIndex].y += 4;
              this.pitElements[pitIndex].colorIndex = 1;
              this.pitElements[this.playerIndex * 7].y += 4;
              this.pitElements[this.playerIndex * 7].colorIndex = 1;
              hand = this.pits[pitIndex];
              this.pits[pitIndex] = 0;
              this.pits[this.playerIndex * 7] += hand;
              Sound.play({ scoreName: "Put" });
            },
            delay: this.delay,
          });
        }
        steps.push({
          func: () => {
            if (
              this.pits.slice(1, 7).reduce((acc, cur) => acc + cur) === 0 ^
              this.pits.slice(8, 14).reduce((acc, cur) => acc + cur) === 0
            ) {
              const playerIndex = this.pits.slice(1, 7).reduce((acc, cur) =>
                  acc + cur
                ) > 0
                ? 0
                : 1;
              hand = 0;
              steps.push({
                func: () => {
                  for (
                    let pitIndex = playerIndex * 7 + 1;
                    pitIndex < playerIndex * 7 + 7;
                    pitIndex++
                  ) {
                    if (this.pits[pitIndex]) {
                      this.pitElements[pitIndex].y -= 4;
                      this.pitElements[pitIndex].colorIndex = 2;
                    }
                  }
                  this.pitElements[playerIndex * 7].y -= 4;
                  this.pitElements[playerIndex * 7].colorIndex = 2;
                  Sound.play({ scoreName: "Pickup" });
                },
                delay: this.delay,
              });
              steps.push({
                func: () => {
                  for (
                    let pitIndex = playerIndex * 7 + 1;
                    pitIndex < playerIndex * 7 + 7;
                    pitIndex++
                  ) {
                    if (this.pits[pitIndex]) {
                      this.pitElements[pitIndex].y += 4;
                      this.pitElements[pitIndex].colorIndex = 1;
                    }
                    hand += this.pits[pitIndex];
                    this.pits[pitIndex] = 0;
                  }
                  this.pits[playerIndex * 7] += hand;
                  this.pitElements[playerIndex * 7].y += 4;
                  this.pitElements[playerIndex * 7].colorIndex = 1;
                  Sound.play({ scoreName: "Put" });
                },
                delay: this.delay,
              });
            }
            steps.push({
              func: () => {
                if (pitIndex % 7 !== 0) {
                  this.playerIndex = (this.playerIndex + 1) % 2;
                }
              },
              delay: 0,
            });
          },
          delay: 0,
        });
      },
      delay: 0,
    });

    Queue.newTask({ steps });
  }
}

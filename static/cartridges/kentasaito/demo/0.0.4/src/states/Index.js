import { Graphic, Input, Queue, Sound, State } from "../../deps.js";

export class Index {
  static numColumn;
  static player;
  static bullet;
  static target;
  static targetSpeed;
  static bulletTask;
  static targetTask;

  static onPush() {
    this.numColumn = Math.floor(Graphic.config.screen.width / 4);
    this.player = Graphic.createSprite({
      graphicName: "player",
      y: Graphic.config.screen.height - 4,
    });
    this.bullet = Graphic.createSprite({
      graphicName: "bullet",
      visible: false,
    });
    this.target = Graphic.createSprite({
      graphicName: "target",
      visible: false,
    });
    this.start();
  }

  static onPop() {
    this.start();
  }

  static start() {
    this.player.x = 0;
    this.player.sceneIndex = 0;
    this.bullet.visible = false;
    this.target.visible = false;
    this.targetSpeed = 0.1;
    this.encount();
  }

  static onFrame() {
    if (Input.statuses[0].directions.left & 2 && this.player.x > 0) {
      this.player.x -= 4;
    }
    if (
      Input.statuses[0].directions.right & 2 &&
      this.player.x < this.numColumn * 4 - 4
    ) {
      this.player.x += 4;
    }
    if (Input.statuses[0].actions.down & 2 && !this.bulletTask) {
      Sound.play({ scoreName: "shoot" });
      this.shoot();
    }
    this.judge();
  }

  static shoot() {
    this.bullet.x = this.player.x;
    this.bullet.y = this.player.y - 2;
    this.bullet.visible = true;
    this.bulletTask = Queue.newTask({
      steps: [
        {
          func: () => {
            this.bullet.y -= 1;
          },
          delay: 1,
        },
      ],
      loop: true,
    });
  }

  static encount() {
    this.target.x = Math.floor(Math.random() * this.numColumn) * 4;
    this.target.y = -3;
    this.target.visible = true;
    this.targetTask = Queue.newTask({
      steps: [
        {
          func: () => {
            if (Math.random() < this.targetSpeed) {
              this.target.y += 1;
            }
          },
          delay: 1,
        },
      ],
      loop: true,
    });
  }

  static judge() {
    if (this.bulletTask) {
      if (this.bullet.y === -2) {
        this.bullet.visible = false;
        Queue.deleteTask({ task: this.bulletTask });
        this.bulletTask = undefined;
      }
      if (
        this.bullet.x === this.target.x && this.bullet.y <= this.target.y
      ) {
        Sound.play({ scoreName: "hit" });
        this.bullet.visible = false;
        Queue.deleteTask({ task: this.bulletTask });
        this.bulletTask = undefined;
        Queue.deleteTask({ task: this.targetTask });
        this.targetSpeed += 0.01;
        this.encount();
      }
    }
    if (this.targetTask) {
      if (this.target.y === Graphic.config.screen.height - 4) {
        Sound.play({ scoreName: "defeat" });
        this.player.sceneIndex = 1;
        Queue.deleteTask({ task: this.bulletTask });
        this.bulletTask = undefined;
        Queue.deleteTask({ task: this.targetTask });
        State.push({
          stateName: "Result",
          params: { targetSpeed: this.targetSpeed },
        });
      }
    }
  }
}

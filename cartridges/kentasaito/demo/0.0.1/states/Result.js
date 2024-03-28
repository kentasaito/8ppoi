import { Graphic, Input, Queue, State } from "../deps.js";

export class Result {
  static busy;
  static label;

  static onPush(params) {
    this.busy = true;
    this.task = Queue.newTask({
      steps: [
        {
          func: () => {
            this.busy = false;
          },
          delay: 60,
        },
      ],
    });
    this.label = Graphic.newLabel({
      fontName: "English",
      params: {
        x: Math.floor((Graphic.config.screen.width - 16) / 2),
        y: Math.floor((Graphic.config.screen.height - 8) / 2),
        visible: true,
        text: Math.floor(params.targetSpeed * 100),
      },
    });
  }

  static onFrame() {
    if (!this.busy && Input.pads[0].statuses.actions.negative) {
      Input.pads[0].statuses.actions.negative = false;
      Graphic.deleteLabel({ label: this.label });
      State.pop();
    }
  }
}

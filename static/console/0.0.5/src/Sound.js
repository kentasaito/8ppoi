import { Queue } from "./Queue.js";
import { Channel } from "./instance/Channel.js";

export class Sound {
  static config;
  static scores;
  static channels;
  static tasks;

  static setup(params) {
    this.config = params.config;
    this.scores = {};
    for (const scoreName of Object.keys(this.config.scores)) {
      this.renderTask({ scoreName });
    }
    this.channels = [];
  }

  static initialize() {
    this.audioContext = new AudioContext();
    for (const channelId of Object.keys(this.config.channels)) {
      this.channels[channelId] = new Channel({
        audioContext: this.audioContext,
        config: this.config.channels[channelId],
      });
    }
  }

  static renderTask(params) {
    this.scores[params.scoreName] = {};
    for (const channelId of Object.keys(this.config.scores[params.scoreName])) {
      this.scores[params.scoreName][channelId] = [];
      for (
        let stepIndex = 0;
        stepIndex < this.config.scores[params.scoreName][channelId].length;
        stepIndex++
      ) {
        this.scores[params.scoreName][channelId][stepIndex] = {
          func: typeof this.config
              .scores[params.scoreName][channelId][stepIndex][0] ===
              "function"
            ? this.config.scores[params.scoreName][channelId][stepIndex][0]
            : () =>
              this.channels[channelId].oscillatorNode.frequency.value =
                this.config.scores[params.scoreName][channelId][stepIndex][0],
          delay: stepIndex
            ? Math.floor(
              this.config.scores[params.scoreName][channelId][stepIndex - 1][1],
            )
            : 0,
        };
      }
      this.scores[params.scoreName][channelId].push({
        func: () =>
          this.channels[channelId].oscillatorNode.frequency.value = null,
        delay: this.config
          .scores[params.scoreName][channelId][
            this.config.scores[params.scoreName][channelId].length - 1
          ][1],
      });
    }
  }

  static play(params) {
    this.stop();
    this.tasks = {};
    for (const channelId of Object.keys(this.scores[params.scoreName])) {
      this.tasks[channelId] = Queue.newTask({
        steps: this.scores[params.scoreName][channelId],
        loop: params.loop,
      });
    }
  }

  static stop() {
    if (this.tasks) {
      for (const channelId of Object.keys(this.tasks)) {
        this.channels[channelId].oscillatorNode.frequency.value = null;
        Queue.deleteTask({ task: this.tasks[channelId] });
      }
    }
  }
}

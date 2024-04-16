import { Task } from "./instance/Task.js";

export class Queue {
  static tasks;
  static taskId;

  static setup() {
    this.tasks = {};
    this.taskId = 0;
  }

  static newTask(params) {
    const taskId = this.taskId++;
    this.tasks[taskId] = new Task(params);
    this.tasks[taskId].taskId = taskId;
    return this.tasks[taskId];
  }

  static deleteTask(params) {
    if (params.task) {
      delete this.tasks[params.task.taskId];
    }
  }

  static onFrame() {
    for (const taskId of Object.keys(this.tasks)) {
      if (this.tasks[taskId]) {
        this.tasks[taskId].onFrame();
        if (this.tasks[taskId]) {
          if (
            this.tasks[taskId].stepIndex === this.tasks[taskId].steps.length
          ) {
            this.deleteTask({ task: this.tasks[taskId] });
          }
        }
      }
    }
  }

  static onPostFrame() {
    for (const taskId of Object.keys(this.tasks)) {
      if (this.tasks[taskId]) {
        this.tasks[taskId].step();
        if (this.tasks[taskId]) {
          if (
            this.tasks[taskId].stepIndex === this.tasks[taskId].steps.length
          ) {
            this.deleteTask({ task: this.tasks[taskId] });
          }
        }
      }
    }
  }
}

export class Task {
  steps;
  loop;
  stepIndex;
  counter;

  constructor(params) {
    this.steps = params.steps;
    this.loop = params.loop;
    this.stepIndex = 0;
    this.counter = 0;
    this.step();
  }

  onFrame() {
    this.counter++;
    this.step();
  }

  step() {
    if (this.counter === this.steps[this.stepIndex]?.delay) {
      this.steps[this.stepIndex].func();
      this.stepIndex++;
      if (this.loop && this.stepIndex === this.steps.length) {
        this.stepIndex = 0;
      }
      this.counter = 0;
      this.step();
    }
  }
}

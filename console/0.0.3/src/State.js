export class State {
  static config;
  static states;
  static stack;

  static setup(params) {
    this.config = params.config;

    this.states = params.states;

    this.stack = [];
    this.push({ stateName: "Index" });
  }

  static push(params) {
    this.stack.push(this.states[params.stateName]);
    this.stack.slice(-1)[0].onPush?.(params?.params);
  }

  static pop(params) {
    this.stack.pop();
    this.stack.slice(-1)[0].onPop?.(params?.params);
  }
}

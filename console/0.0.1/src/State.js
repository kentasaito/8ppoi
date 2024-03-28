export class State {
  static config;
  static states;
  static stack;

  static async setup(params) {
    this.config = (await import(
      "../../../cartridges/" + params.cartridge.author + "/" +
        params.cartridge.name + "/" +
        params.cartridge.version + "/config/state.js"
    )).default;

    this.states = [];
    for (const stateName of this.config.stateNames) {
      this.states[stateName] = (await import(
        "../../../cartridges/" + params.cartridge.author + "/" +
          params.cartridge.name + "/" +
          params.cartridge.version + "/states/" + stateName + ".js"
      ))[stateName];
    }

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

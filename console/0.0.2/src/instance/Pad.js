import { default as config } from "../../../../config/input.js";

export class Pad {
  constructor(params) {
    const local = {
      keys: JSON.parse(
        localStorage["Input.pads[" + params.padId + "].keys"] || "{}",
      ),
      aliases: JSON.parse(
        localStorage["Input.pads[" + params.padId + "].aliases"] || "{}",
      ),
    };
    this.keys = {
      directions: {
        left: local.keys?.directions?.left ??
          config.pads[params.padId].keys.directions.left,
        right: local.keys?.directions?.right ??
          config.pads[params.padId].keys.directions.right,
        up: local.keys?.directions?.up ??
          config.pads[params.padId].keys.directions.up,
        down: local.keys?.directions?.down ??
          config.pads[params.padId].keys.directions.down,
      },
      actions: {
        0: local.keys?.actions?.[0] ??
          config.pads[params.padId].keys.actions[0],
        1: local.keys?.actions?.[1] ??
          config.pads[params.padId].keys.actions[1],
      },
      slot: {
        insert: local.keys?.slot?.insert ??
          config.pads[params.padId].keys.slot.insert,
        start: local.keys?.slot?.start ??
          config.pads[params.padId].keys.slot.start,
      },
    };
    this.aliases = {
      actions: {
        positive: local.aliases?.actions?.positive ??
          config.pads[params.padId].aliases.actions.positive,
        negative: local.aliases?.actions?.negative ??
          config.pads[params.padId].aliases.actions.negative,
      },
    };
    this.statuses = {
      directions: {
        left: false,
        right: false,
        up: false,
        down: false,
      },
      actions: {
        0: false,
        1: false,
      },
      slot: {
        insert: false,
        start: false,
      },
    };
    Object.defineProperties(this.statuses.actions, {
      positive: {
        get: () => this.statuses.actions[this.aliases.actions.positive],
        set: (value) =>
          this.statuses.actions[this.aliases.actions.positive] = value,
      },
      negative: {
        get: () => this.statuses.actions[this.aliases.actions.negative],
        set: (value) =>
          this.statuses.actions[this.aliases.actions.negative] = value,
      },
    });
  }
}

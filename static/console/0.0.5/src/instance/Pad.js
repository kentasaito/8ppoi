import { default as config } from "../../../../config/input.js";

export class Pad {
  constructor(params) {
    const local = {
      keys: JSON.parse(
        localStorage["Input.pads[" + params.padId + "].keys"] || "{}",
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
        left: local.keys?.actions?.left ??
          config.pads[params.padId].keys.actions.left,
        right: local.keys?.actions?.right ??
          config.pads[params.padId].keys.actions.right,
        up: local.keys?.actions?.up ??
          config.pads[params.padId].keys.actions.up,
        down: local.keys?.actions?.down ??
          config.pads[params.padId].keys.actions.down,
      },
    };
    this.statuses = {
      directions: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
      },
      actions: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
      },
    };
  }
}

import { defaultColorSet, modernDos8x8 } from "../deps.js";
import { default as player } from "./sprites/player.js";
import { default as bullet } from "./sprites/bullet.js";
import { default as target } from "./sprites/target.js";

const scale = 16;

export default {
  screen: {
    width: 320 / scale,
    height: 240 / scale,
    scale,
    backgroundColor: "hsl(0, 0%, 0%)",
    colorSetName: "default",
  },
  colorSets: {
    default: defaultColorSet,
  },
  fonts: {
    default: {
      module: modernDos8x8,
      palette: [0],
    },
  },
  sprites: {
    player: {
      module: player,
      palette: [4],
    },
    bullet: {
      module: bullet,
      palette: [12],
    },
    target: {
      module: target,
      palette: [20],
    },
  },
  backgrounds: {},
};

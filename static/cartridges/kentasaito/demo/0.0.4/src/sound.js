import { default as shoot } from "./scores/shoot.js";
import { default as hit } from "./scores/hit.js";
import { default as defeat } from "./scores/defeat.js";

export default {
  channels: [
    {
      gain: 1 / 4,
      type: "square",
    },
  ],
  scores: {
    shoot,
    hit,
    defeat,
  },
};

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
    default: (await import("./colorSets/default.js")).default,
    grayscale: (await import("./colorSets/grayscale.js")).default,
  },
  fonts: {
    default: {
      module: (await import("./fonts/modernDos4378x8.js")).default,
      palette: [0],
    },
  },
  sprites: {
    player: {
      module: (await import("./sprites/player.js")).default,
      palette: [4],
    },
    bullet: {
      module: (await import("./sprites/bullet.js")).default,
      palette: [12],
    },
    target: {
      module: (await import("./sprites/target.js")).default,
      palette: [20],
    },
  },
  backgrounds: {},
};

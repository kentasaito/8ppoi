const diminution = 16;
const hue = 360 / 5;
const saturation = 50;
const lightness = 80;

export default {
  screen: {
    width: 320 / diminution,
    height: 240 / diminution,
  },
  colors: [
    `hsl(${hue * 0}, ${0}%, ${0}%)`,
    `hsl(${hue * 0}, ${0}%, ${lightness}%)`,
    `hsl(${hue * 0}, ${saturation}%, ${lightness}%)`,
    `hsl(${hue * 1}, ${saturation}%, ${lightness}%)`,
    `hsl(${hue * 2}, ${saturation}%, ${lightness}%)`,
    `hsl(${hue * 3}, ${saturation}%, ${lightness}%)`,
    `hsl(${hue * 4}, ${saturation}%, ${lightness}%)`,
  ],
  fonts: {
    "English": {
      fontFamily: "ModernDOS8x8",
      fontSize: "16px",
    },
  },
  sprites: {
    Player: [
      [
        [0, 2, 0],
        [2, 2, 2],
        [2, 0, 2],
      ],
      [
        [2, 0, 2],
        [0, 0, 0],
        [2, 0, 2],
      ],
    ],
    Bullet: [
      [
        [0, 3, 0],
        [0, 3, 0],
        [0, 0, 0],
      ],
    ],
    Target: [
      [
        [0, 4, 0],
        [4, 0, 4],
        [0, 4, 0],
      ],
    ],
  },
};

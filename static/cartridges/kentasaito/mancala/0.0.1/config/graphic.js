const diminution = 2;

export default {
  screen: {
    width: 320 / diminution,
    height: 240 / diminution,
  },
  colors: [
    `hsl(0, 0%, 0%)`,
    `hsl(0, 0%, 60%)`,
    `hsl(0, 0%, 100%)`,
  ],
  fonts: {
    "English": {
      fontFamily: "ModernDOS8x8",
      fontSize: "16px",
    },
  },
  sprites: {
    Cursor: [
      [
        [1, 1, 1, 1, 1, 1, 1, 1],
      ],
    ],
  },
};

export default {
  pads: [
    {
      keys: {
        directions: {
          left: "j",
          right: "l",
          up: "i",
          down: "k",
        },
        actions: {
          0: "f",
          1: "d",
        },
        slot: {
          insert: "g",
          start: "h",
        },
      },
      aliases: {
        actions: {
          positive: 0,
          negative: 1,
        },
      },
    },
    {
      keys: {
        directions: {
          left: "ArrowLeft",
          right: "ArrowRight",
          up: "ArrowUp",
          down: "ArrorDown",
        },
        actions: {
          0: "x",
          1: "z",
        },
        slot: {
          insert: "c",
          start: "v",
        },
      },
      aliases: {
        actions: {
          positive: 0,
          negative: 1,
        },
      },
    },
  ],
};

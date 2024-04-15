const baseFrequency = 110;
const baseFrames = 48;

export default {
  channels: [
    {
      gain: 1 / 4,
      type: "square",
    },
  ],
  scores: {
    Pickup: [
      [
        [baseFrequency * 8, baseFrames / 16],
      ],
    ],
    Put: [
      [
        [baseFrequency * 4, baseFrames / 24],
      ],
    ],
  },
};

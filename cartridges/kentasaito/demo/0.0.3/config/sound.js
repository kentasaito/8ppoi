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
    Shoot: [
      [
        [baseFrequency * 8, baseFrames / 16],
        [baseFrequency * 7, baseFrames / 16],
        [baseFrequency * 6, baseFrames / 16],
        [baseFrequency * 5, baseFrames / 16],
        [baseFrequency * 4, baseFrames / 16],
        [baseFrequency * 3, baseFrames / 16],
        [baseFrequency * 2, baseFrames / 16],
        [baseFrequency * 1, baseFrames / 16],
      ],
    ],
    Hit: [
      [
        [baseFrequency * 4, baseFrames / 24],
        [baseFrequency * 5, baseFrames / 24],
        [baseFrequency * 6, baseFrames / 24],
        [baseFrequency * 7, baseFrames / 24],
        [baseFrequency * 8, baseFrames / 24],
      ],
    ],
    Defeat: [
      [
        [baseFrequency / 2 * 8, baseFrames / 8],
        [baseFrequency / 2 * 7, baseFrames / 8],
        [baseFrequency / 2 * 6, baseFrames / 8],
        [baseFrequency / 2 * 5, baseFrames / 8],
        [baseFrequency / 2 * 4, baseFrames / 8],
      ],
    ],
  },
};

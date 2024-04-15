const numHue = 12;
const saturation = 50;
const numLightness = 4;

export default [
  Array(numLightness).fill().map((_, l) =>
    `hsl(0, 0%, ${(numLightness - l) * 100 / (numLightness + 1)}%)`
  ),
  Array(numHue).fill().map((_, h) =>
    Array(numLightness).fill().map((_, l) =>
      `hsl(${h * 360 / numHue}, ${saturation}%, ${
        (numLightness - l) * 100 / (numLightness + 1)
      }%)`
    )
  ).flat(),
].flat();

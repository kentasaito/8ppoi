import { Path } from "./Path.js";

export class Layer {
  pathData;

  constructor(bitmap, colorId) {
    const vectors = [];
    for (let y = 0; y <= bitmap.length; y++) {
      vectors[y] = [];
      for (let x = 0; x <= bitmap[0].length; x++) {
        vectors[y][x] = {
          horizontal:
            bitmap[y - 1]?.[x] !== colorId && bitmap[y]?.[x] === colorId
              ? true
              : bitmap[y - 1]?.[x] === colorId && !bitmap[y]?.[x] !== colorId
              ? false
              : null,
          vertical: bitmap[y]?.[x - 1] === colorId && bitmap[y]?.[x] !== colorId
            ? true
            : bitmap[y]?.[x - 1] !== colorId && bitmap[y]?.[x] === colorId
            ? false
            : null,
        };
      }
    }
    this.pathData = [];
    while (true) {
      const pathDatum = this.getPathDatum(vectors);
      if (!pathDatum) break;
      this.pathData.push(pathDatum);
    }
  }

  getPathDatum(vectors) {
    for (let y = 0; y < vectors.length; y++) {
      for (let x = 0; x < vectors[0].length; x++) {
        const startAt = { x, y };
        const path = new Path(vectors, startAt);
        if (path.steps.length === 0) continue;
        const pathDatum = [`M${Object.values(startAt).join(",")}`];
        let buffer;
        for (const step of path.steps) {
          if (step.type === buffer?.type) {
            buffer.delta += step.delta;
          } else {
            if (buffer) {
              pathDatum.push(
                `${
                  { horizontal: "h", vertical: "v" }[buffer.type]
                }${buffer.delta}`,
              );
            }
            buffer = structuredClone(step);
          }
        }
        pathDatum.push("Z");
        return pathDatum;
      }
    }
  }
}

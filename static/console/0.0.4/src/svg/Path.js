export class Path {
  steps;

  constructor(vectors, startAt) {
    this.steps = [];
    const current = structuredClone(startAt);

    while (true) {
      const step = this.getStep(vectors, current);
      if (!step) break;
      this.steps.push(step);
    }
  }

  getStep(vectors, current) {
    if (vectors[current.y][current.x].horizontal === true) {
      vectors[current.y][current.x].horizontal = null;
      current.x++;
      return { type: "horizontal", delta: 1 };
    }
    if (vectors[current.y][current.x].vertical === true) {
      vectors[current.y][current.x].vertical = null;
      current.y++;
      return { type: "vertical", delta: 1 };
    }
    if (vectors[current.y][current.x - 1]?.horizontal === false) {
      vectors[current.y][current.x - 1].horizontal = null;
      current.x--;
      return { type: "horizontal", delta: -1 };
    }
    if (vectors[current.y - 1]?.[current.x].vertical === false) {
      vectors[current.y - 1][current.x].vertical = null;
      current.y--;
      return { type: "vertical", delta: -1 };
    }
  }
}

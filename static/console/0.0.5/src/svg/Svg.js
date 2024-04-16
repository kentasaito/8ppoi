import { Layer } from "./Layer.js";

export class Svg {
  static render(graphicName, bitmap) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.dataset.graphicName = graphicName;
    svg.setAttribute("width", bitmap[0].length);
    svg.setAttribute("height", bitmap.length);
    svg.setAttribute("viewBox", `0 0 ${bitmap[0].length} ${bitmap.length}`);

    for (
      const colorId of Array.from(new Set(bitmap.flat())).filter((colorId) =>
        colorId > 0
      )
    ) {
      const layer = new Layer(bitmap, colorId);
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.classList.add(`layer${colorId}`);
      path.setAttribute(
        "d",
        `${layer.pathData.map((pathDatum) => pathDatum.join(" ")).join(" ")}`,
      );
      svg.append(path);
    }

    return svg;
  }
}

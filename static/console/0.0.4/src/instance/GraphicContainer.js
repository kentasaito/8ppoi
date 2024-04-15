import { Graphic } from "../Graphic.js";

export class GraphicContainer {
  params;
  container;
  table;

  constructor(params) {
    this.params = Object.assign(
      {
        parent: Graphic.screenContent,
        x: 0,
        y: 0,
        visible: true,
        scale: "1",
        rotate: "none",
      },
      params,
    );

    Object.defineProperties(this, {
      parent: {
        get: () => this.params.parent,
        set: (value) => (this.params.parent = value).append(this.container),
      },
      x: {
        get: () => this.params.x,
        set: (value) =>
          this.container.style.left = (this.params.x = value) + "px",
      },
      y: {
        get: () => this.params.y,
        set: (value) =>
          this.container.style.top = (this.params.y = value) + "px",
      },
      visible: {
        get: () => this.params.visible,
        set: (value) => {
          this.params.visible = value;
          this.container.style.visibility = this.params.visible
            ? "visible"
            : "hidden";
        },
      },
      scale: {
        get: () => this.params.scale,
        set: (value) => this.container.style.scale = this.params.scale = value,
      },
      rotate: {
        get: () => this.params.rotate,
        set: (value) =>
          this.container.style.rotate = this.params.rotate = value,
      },
    });

    this.table = document.createElement("table");
    this.table.style.borderCollapse = "collapse";

    this.container = document.createElement("div");
    this.container.append(this.table);
    this.container.style.position = "absolute";

    this.parent = this.params.parent;
    this.x = this.params.x;
    this.y = this.params.y;
    this.visible = this.params.visible;
    this.scale = this.params.scale;
    this.rotate = this.params.rotate;
  }

  appendRow() {
    const tr = document.createElement("tr");
    this.table.append(tr);
    return tr;
  }

  appendColumn(params) {
    const td = document.createElement("td");
    td.style.padding = 0;
    td.style.fontSize = 0;
    params.tr.append(td);
    return td;
  }

  remove() {
    this.container.remove();
    delete Graphic.graphicContainers[this.params.id];
  }
}

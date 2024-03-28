import { Graphic } from "../Graphic.js";

export class Label {
  element;
  _x;
  _y;
  _visible;
  _text;
  _colorIndex;

  constructor(params) {
    this.element = params.element.cloneNode(true);
    Object.defineProperties(this, {
      x: {
        get: () => this._x,
        set: (value) => this.element.style.left = (this._x = value) + "px",
      },
      y: {
        get: () => this._y,
        set: (value) => this.element.style.top = (this._y = value) + "px",
      },
      visible: {
        get: () => this._visible,
        set: (value) =>
          this.element.style.visibility = value ? "visible" : "hidden",
      },
      text: {
        get: () => this._text,
        set: (value) => this.element.innerText = value,
      },
      colorIndex: {
        get: () => this._colorIndex,
        set: (value) => {
          this._colorIndex = value;
          this.element.style.color = Graphic.config.colors[this._colorIndex];
        },
      },
    });
    this.x = params?.params?.x ?? 0;
    this.y = params?.params?.y ?? 0;
    this.visible = params?.params?.visible ?? false;
    this.text = params?.params?.text ?? "";
    this.colorIndex = params?.params?.colorIndex ?? 1;
  }
}

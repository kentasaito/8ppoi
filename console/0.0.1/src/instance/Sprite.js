export class Sprite {
  element;
  _x;
  _y;
  _visible;
  _sceneIndex;

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
      sceneIndex: {
        get: () => this._sceneIndex,
        set: (value) =>
          this.element.firstChild.style.marginTop =
            -1 * parseInt(this.element.style.height) * value + "px",
      },
    });
    this.x = params?.params?.x ?? 0;
    this.y = params?.params?.y ?? 0;
    this.visible = params?.params?.visible ?? false;
    this.sceneIndex = params?.params?.sceneIndex ?? 0;
  }
}

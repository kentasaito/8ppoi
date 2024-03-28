import { Sprite } from "./instance/Sprite.js";
import { Label } from "./instance/Label.js";

export class Graphic {
  static config;
  static screen;
  static spriteElements;
  static sprites;
  static spriteId;
  static labelElements;
  static labels;
  static labelId;

  static async setup(params) {
    this.config = (await import(
      "../../../cartridges/" + params.cartridge.author + "/" +
        params.cartridge.name + "/" +
        params.cartridge.version + "/config/graphic.js"
    )).default;

    this.screen = document.getElementById("screen");
    this.screen.style.overflow = "hidden";
    this.screen.style.position = "relative";
    this.screen.style.width = this.config.screen.width + "px";
    this.screen.style.height = this.config.screen.height + "px";
    this.screen.style.backgroundColor = this.config.colors[0];
    this.screen.style.transformOrigin = "0 0";
    this.screen.style.transform = "scale(" +
      Math.floor(
        Math.min(
          320 / this.config.screen.width,
          240 / this.config.screen.height,
        ),
      ) + ")";

    this.spriteElements = {};
    for (const spriteName of Object.keys(this.config.sprites)) {
      const sprite = this.config.sprites[spriteName];
      const spriteElement = document.createElement("div");
      spriteElement.style.overflow = "hidden";
      spriteElement.style.position = "absolute";
      spriteElement.style.width = sprite[0][0].length + "px";
      spriteElement.style.height = sprite[0].length + "px";

      const sceneElement = document.createElement("div");
      sceneElement.style.position = "absolute";
      sceneElement.style.width = sprite[0][0].length + "px";
      sceneElement.style.height = sprite.length * sprite[0].length + "px";

      for (const sceneIndex of Object.keys(sprite)) {
        for (const rowIndex of Object.keys(sprite[sceneIndex])) {
          for (const columnIndex of Object.keys(sprite[sceneIndex][rowIndex])) {
            const colorIndex = sprite[sceneIndex][rowIndex][columnIndex];
            if (colorIndex === 0) continue;
            const pixel = document.createElement("div");
            pixel.style.position = "absolute";
            pixel.style.width = 1 + "px";
            pixel.style.height = 1 + "px";
            pixel.style.left = columnIndex + "px";
            pixel.style.top = sprite[0].length * parseInt(sceneIndex) +
              parseInt(rowIndex) + "px";
            pixel.style.backgroundColor = this.config.colors[colorIndex];
            sceneElement.append(pixel);
          }
        }
      }
      spriteElement.append(sceneElement);
      this.spriteElements[spriteName] = spriteElement;
    }

    this.sprites = {};
    this.spriteId = 0;

    this.labelElements = {};
    for (const fontName of Object.keys(this.config.fonts)) {
      const font = this.config.fonts[fontName];
      const labelElement = document.createElement("div");
      labelElement.style.position = "absolute";
      for (const key of Object.keys(font)) {
        labelElement.style[key] = font[key];
      }
      labelElement.style.color = this.config.colors[1];
      this.labelElements[fontName] = labelElement;
    }

    this.labels = {};
    this.labelId = 0;
  }

  static newSprite(params) {
    const spriteId = this.spriteId++;
    this.sprites[spriteId] = new Sprite({
      element: this.spriteElements[params.spriteName],
      params: params.params,
    });
    this.sprites[spriteId].spriteId = spriteId;
    this.screen.append(this.sprites[spriteId].element);
    return this.sprites[spriteId];
  }

  static deleteSprite(params) {
    params.sprite.element.remove();
    delete this.sprites[params.sprite.spriteId];
  }

  static newLabel(params) {
    const labelId = this.labelId++;
    this.labels[labelId] = new Label({
      element: this.labelElements[params.fontName],
      params: params.params,
    });
    this.labels[labelId].labelId = labelId;
    this.screen.append(this.labels[labelId].element);
    return this.labels[labelId];
  }

  static deleteLabel(params) {
    params.label.element.remove();
    delete this.labels[params.label.labelId];
  }
}

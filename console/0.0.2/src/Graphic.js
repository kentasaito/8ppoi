import { Svg } from "./svg/Svg.js";
import { GraphicContainer } from "./instance/GraphicContainer.js";

export class Graphic {
  screen;
  screenContent;
  colors;
  graphicContainers;
  fonts;
  sprites;
  backgrounds;

  static setup(params) {
    this.config = params.config;

    this.screen = document.getElementById("screen");

    this.screen.style.width = `${
      this.config.screen.width * this.config.screen.scale
    }px`;
    this.screen.style.height = `${
      this.config.screen.height * this.config.screen.scale
    }px`;

    this.screenContent = document.createElement("div");
    this.screen.append(this.screenContent);

    this.screenContent.style.overflow = "hidden";
    this.screenContent.style.width = `${this.config.screen.width}px`;
    this.screenContent.style.height = `${this.config.screen.height}px`;
    this.screenContent.style.transformOrigin = "0 0";
    this.screenContent.style.transform = `scale(${this.config.screen.scale})`;
    this.screenContent.style.backgroundColor =
      this.config.screen.backgroundColor;

    this.colors = this.setupColors(this.config.colorSets);
    this.colorSetName = this.config.screen.colorSetName;

    this.graphicContainers = {};
    for (const type of ["fonts", "sprites", "backgrounds"]) {
      this[type] = this.setupGraphics(this.config[type]);
    }
  }

  static setupColors(params) {
    this._colors = {};
    const colors = {};

    for (const colorSetName in params) {
      this._colors[colorSetName] = [];
      for (const colorIndex in params[colorSetName]) {
        this._colors[colorSetName][colorIndex] = {
          cssStyleSheet: new CSSStyleSheet(),
        };
        document.adoptedStyleSheets.push(
          this._colors[colorSetName][colorIndex].cssStyleSheet,
        );
      }

      colors[colorSetName] = new Proxy(this._colors[colorSetName], {
        get: (target, colorIndex) => target[colorIndex].value,
        set: (target, colorIndex, value) => {
          target[colorIndex].value = value;
          target[colorIndex].cssStyleSheet.replaceSync(
            `[data-color-set-name="${colorSetName}"] { --color${colorIndex}: ${value}; }`,
          );
          return true;
        },
      });
      for (const colorIndex in params[colorSetName]) {
        colors[colorSetName][colorIndex] = params[colorSetName][colorIndex];
      }
    }

    Object.defineProperty(this, "colorSetName", {
      get: () => this._colorSetName,
      set: (value) => {
        this._colorSetName = value;
        this.screen.dataset.colorSetName = this._colorSetName;
      },
    });

    return colors;
  }

  static setupGraphics(params) {
    const graphics = {};

    for (const graphicName in params) {
      graphics[graphicName] = {
        cssStyleSheet: new CSSStyleSheet(),
        svgs: {},
      };
      document.adoptedStyleSheets.push(graphics[graphicName].cssStyleSheet);

      Object.defineProperty(graphics[graphicName], "palette", {
        get: () => graphics[graphicName]._palette,
        set: (value) => {
          graphics[graphicName]._palette = value;
          graphics[graphicName].cssStyleSheet.replaceSync(
            `[data-graphic-name="${graphicName}"] {
            ${
              value.map((v, i) => `.layer${i + 1} { fill: var(--color${v}) }`)
                .join("\n")
            }
          }`,
          );
        },
      });

      graphics[graphicName].palette = params[graphicName].palette;

      for (const i in params[graphicName].module.bitmaps) {
        const sceneIndex = params[graphicName].module.codePoints?.[i] ?? i;
        graphics[graphicName].svgs[sceneIndex] = Svg.render(
          graphicName,
          params[graphicName].module.bitmaps[i],
        );
      }
    }

    return graphics;
  }

  static createGraphicContainer(params) {
    const graphicContainer = new GraphicContainer(params);
    this.graphicContainers[graphicContainer.params.id] = graphicContainer;
    for (let y = 0; y < params.height; y++) {
      const tr = graphicContainer.appendRow();
      for (let x = 0; x < params.width; x++) {
        graphicContainer.appendColumn({ tr });
      }
    }
    return graphicContainer;
  }

  static createText(params) {
    const graphicContainer = this.createGraphicContainer(
      Object.assign(params, { width: 0, height: 0 }),
    );

    Object.defineProperty(graphicContainer, "text", {
      get: () => graphicContainer._text,
      set: (value) => {
        graphicContainer._text = value;
        graphicContainer.table.innerText = "";
        const lines = graphicContainer._text.split("\n");
        for (const y in lines) {
          const tr = graphicContainer.appendRow();
          const td = graphicContainer.appendColumn({ tr });
          for (const x in lines[y]) {
            td.append(
              this.fonts[graphicContainer.params.graphicName]
                .svgs[lines[y].charCodeAt(x)].cloneNode(true),
            );
          }
        }
      },
    });
    graphicContainer.text = params.text;

    return graphicContainer;
  }

  static createSprite(params) {
    const graphicContainer = this.createGraphicContainer(
      Object.assign(params, { width: 1, height: 1 }),
    );

    Object.defineProperty(graphicContainer, "sceneIndex", {
      get: () => graphicContainer._sceneIndex,
      set: (value) => {
        graphicContainer._sceneIndex = value;
        const td = graphicContainer.table.querySelector("td");
        td.innerText = "";
        td.append(
          this.sprites[graphicContainer.params.graphicName]
            .svgs[graphicContainer._sceneIndex].cloneNode(true),
        );
        graphicContainer.palette = params.palette;
      },
    });
    graphicContainer.sceneIndex = params.sceneIndex ?? 0;

    return graphicContainer;
  }

  static createBackground(params) {
    const graphicContainer = this.createGraphicContainer(
      Object.assign(params, {
        width: params.graphicNames[0].length,
        height: params.graphicNames.length,
      }),
    );

    graphicContainer._graphicNames = params.graphicNames;
    graphicContainer._sceneIndexes = params.graphicNames.map((row) =>
      row.map(() => 0)
    );
    graphicContainer.graphicNames = [];
    graphicContainer.sceneIndexes = [];
    for (const y in params.graphicNames) {
      graphicContainer.graphicNames[y] = new Proxy(
        graphicContainer._graphicNames[y],
        {
          get: (target, x) => target[x],
          set: (target, x, value) => {
            target[x] = value;
            graphicContainer._sceneIndexes[y][x] = 0;
            const td =
              graphicContainer.table.querySelectorAll("tr")[y].querySelectorAll(
                "td",
              )[x];
            td.innerText = "";
            td.append(
              this.backgrounds[target[x]]
                .svgs[graphicContainer._sceneIndexes[y][x]].cloneNode(true),
            );
            return true;
          },
        },
      );
      graphicContainer.sceneIndexes[y] = new Proxy(
        graphicContainer._sceneIndexes[y],
        {
          get: (target, x) => target[x],
          set: (target, x, value) => {
            target[x] = value;
            const td =
              graphicContainer.table.querySelectorAll("tr")[y].querySelectorAll(
                "td",
              )[x];
            td.innerText = "";
            td.append(
              this.backgrounds[graphicContainer._graphicNames[y][x]]
                .svgs[target[x]].cloneNode(true),
            );
            return true;
          },
        },
      );
    }
    for (const y in params.graphicNames) {
      for (const x in params.graphicNames[y]) {
        graphicContainer.graphicNames[y][x] = params.graphicNames[y][x];
      }
    }

    return graphicContainer;
  }

  static removeAll() {
    for (const graphicContainerId of Object.keys(this.graphicContainers)) {
      this.graphicContainers[graphicContainerId].remove();
    }
  }
}

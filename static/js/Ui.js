export class Ui {
  // セットアップ
  static setup(params) {
    document.getElementById("captureContainer").style.backgroundImage =
      `url("./cartridges/${params.cartridge.author}/${params.cartridge.name}/${params.cartridge.version}/capture.png")`;

    // カートリッジ情報
    document.getElementById("cartridge").innerText =
      `${params.information.name} (${params.cartridge.version}) by ${params.information.author}`;
    document.getElementById("cartridgeName").innerText =
      `${params.information.name} (${params.cartridge.version})`;
    document.getElementById("authorName").innerText = params.information.author;
    document.getElementById("instruction").innerText =
      params.information.instruction;

    // リサイズ処理のセットアップ
    globalThis.onresize = () => this.onResize();
    this.onResize();
  }

  // リサイズ処理
  static onResize() {
    let scale;

    // スケール
    if (document.fullscreenElement) { // フルスクリーン
      scale = Math.min(
        globalThis.innerWidth / 320,
        globalThis.innerHeight / 240,
      );
    } else { // 通常
      scale = Math.floor(Math.max(
        1,
        Math.min(globalThis.innerWidth / 360, globalThis.innerHeight / 320),
      ));
    }

    let marginTop = 0;
    if (document.fullscreenElement) {
      if (!globalThis.Touch) {
        marginTop = (globalThis.outerHeight - 240 * scale) / 2;
      } else if (screen.orientation.type.startsWith("portrait-")) {
        marginTop = (globalThis.outerHeight - (240 + 120) * scale) / 2;
      }
    }
    document.getElementById("fullscreen").style.height = `${240 * scale}px`;
    document.getElementById("screenContainer").style.marginTop =
      `${marginTop}px`;
    document.getElementById("screenContainer").style.scale = scale;
    document.getElementById("contents").style.width = `${320 * scale}px`;

    // パッドのリサイズ
    this.resizePad(scale);
  }

  // パッドのリサイズ
  static resizePad(scale) {
    let parentElementId;
    let display;
    let size;
    let marginTop;

    // 親要素と表示
    if (
      document.fullscreenElement ||
      screen.orientation.type.startsWith("landscape-")
    ) {
      parentElementId = "fullscreen";
      display = "none";
    } else {
      parentElementId = "padContainer";
      display = "block";
    }
    document.getElementById(parentElementId).append(
      document.getElementById("pad"),
    );
    document.getElementById("padContainer").style.display = display;

    // サイズと位置
    if (screen.orientation.type.startsWith("landscape-")) { // 横
      size = Math.min(120, (globalThis.innerWidth - 320 * scale) / 2);
      marginTop = 240 * (scale - 1) - (240 * scale + size) / 2;
    } else { // 縦
      size = 120 * scale;
      marginTop = 240 * (scale - 1);
    }
    document.getElementById("padContainer").style.height = `${size}px`;
    document.getElementById("pad").style.marginTop = `${marginTop}px`;
    document.getElementById("pad").style.height = `${size}px`;
    for (const diamond of document.querySelectorAll("#pad .diamond")) {
      diamond.style.width = `${size}px`;
      diamond.style.height = `${size}px`;
    }
  }

  static setupEvents(params) {
    // フルスクリーン要求
    document.getElementById("requestFullscreen").onclick = (event) => {
      event.stopPropagation();
      document.getElementById("fullscreen").requestFullscreen();
    };

    // フルスクリーン解除
    document.getElementById("exitFullscreen").onclick = (event) => {
      event.stopPropagation();
      document.exitFullscreen();
    };

    // スタート
    document.getElementById("start").onclick = (event) => {
      event.stopPropagation();
      if (!params.Console.playing) {
        document.getElementById("captureContainer").style.backgroundImage = "";
        document.getElementById("menu").style.visibility = "hidden";
        params.Console.start();
      }
    };

    // ポーズ
    document.getElementById("screenContainer").onclick = (event) => {
      event.stopPropagation();
      if (params.Console.playing) {
        document.getElementById("menu").style.visibility = "visible";
        params.Console.pause();
      }
    };
  }
}

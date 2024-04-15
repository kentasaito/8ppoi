import { basename } from "https://deno.land/std@0.221.0/path/mod.ts";
import { Image } from "https://deno.land/x/imagescript@v1.2.14/mod.ts";
import { writeAll } from "https://deno.land/std@0.221.0/io/write_all.ts?s=writeAll";

async function fontTo8ppoiFont(params) {
  const font = await Deno.readFile(
    "./original/" + params.originalFont.filename,
  );
  let str = "";

  const codePoints = params.charset.split(" ").map((v) => {
    const pair = v.split("-").map((v) => parseInt(v, 16));
    const length = (pair[1] ?? pair[0]) - pair[0] + 1;
    return Array(length).fill().map((_, i) => pair[0] + i);
  }).flat();

  for (const codePoint of codePoints) {
    let buf = "";
    try {
      const img = await Image.renderText(
        font,
        params.fontSize,
        String.fromCharCode(codePoint),
        0x000000ff,
      );
      for (let y = 0; y < params.width; y++) {
        const row = [];
        for (let x = 0; x < params.height; x++) {
          row.push(
            y < img.__height__ && x < img.__width__ &&
              img.getPixelAt(x + 1, y + 1)
              ? 1
              : 0,
          );
        }
        buf += `      [${row.join(", ")}],\n`;
      }
    } catch (_error) {
      for (let y = 0; y < params.width; y++) {
        const row = [];
        for (let x = 0; x < params.height; x++) {
          row.push(0);
        }
        buf += `      [${row.join(", ")}],\n`;
      }
    }
    str += `    [\n${buf}    ],\n`;
  }

  await Deno.writeTextFile(
    "./extracted/" + params.filename,
    `/*
 * It was extracted from:
 * ${params.originalFont.filename} by ${params.originalFont.author} licensed under ${params.originalFont.license}
 */
export default {
  codePoints: [${
      codePoints.map((v) => "0x" + v.toString(16).toUpperCase()).join(", ")
    }],
  bitmaps: [
${str}  ],
};
`,
  );
}

for (const arg of Deno.args) {
  const text = new TextEncoder().encode(arg + "... ");
  await writeAll(Deno.stdout, text);

  const params = (await import(arg)).default;
  params.filename = basename(arg);
  await fontTo8ppoiFont(params);
  console.log("Done.");
}

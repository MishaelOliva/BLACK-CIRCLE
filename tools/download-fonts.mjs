import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const root = process.cwd();
const fontsDir = path.join(root, "assets", "fonts");
fs.mkdirSync(fontsDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

function fetchCss(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } }, res => {
      let d = "";
      res.on("data", c => (d += c));
      res.on("end", () => resolve(d));
    }).on("error", reject);
  });
}

async function run() {
  const url = "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
  console.log("Fetching Google Fonts CSS...");
  const css = await fetchCss(url);
  const blocks = css.split("@font-face").slice(1);
  let localCss = "/* Locally hosted fonts for offline fantasy academy aesthetic */\n";
  let count = 0;

  for (const block of blocks) {
    if (!block.includes("U+0000-00FF")) continue;
    const famMatch = block.match(/font-family:\s*['"]([^'"]+)['"]/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const urlMatch = block.match(/url\((https:[^)]+\.woff2)\)/);

    if (famMatch && styleMatch && weightMatch && urlMatch) {
      const family = famMatch[1];
      const style = styleMatch[1].trim();
      const weight = weightMatch[1].trim();
      const fontUrl = urlMatch[1];
      const cleanName = `${family.replace(/\s+/g, "")}-${weight}${style === "italic" ? "-italic" : ""}.woff2`;
      const destPath = path.join(fontsDir, cleanName);

      if (!fs.existsSync(destPath)) {
        console.log(`Downloading ${cleanName}...`);
        await download(fontUrl, destPath);
      }

      localCss += `@font-face {\n  font-family: '${family}';\n  font-style: ${style};\n  font-weight: ${weight};\n  font-display: swap;\n  src: url("../fonts/${cleanName}") format("woff2");\n}\n\n`;
      count++;
    }
  }

  const cssPath = path.join(root, "assets", "ui", "fonts.css");
  fs.writeFileSync(cssPath, localCss, "utf8");
  console.log(`Successfully downloaded ${count} font files and generated ${cssPath}`);
}

run().catch(console.error);

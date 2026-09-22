import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.dirname(root);
const exe = path.join(projectRoot, "bin", "codex-image.exe");
const buildSite = fs.readFileSync(path.join(projectRoot, "build-site.mjs"), "utf8");
const runRoot = path.join(projectRoot, "tmp", "episode-21-25-regeneration-20260712");

const shared = [
  "Use case: illustration-story.",
  "Read and match local reference images in C:\\STORY\\SOURCE OF TRUTH ARTSTYLE first, then C:\\STORY\\SOURCE OF TRUTH CHARACTER FEATURES; these are authoritative for rendering style and character identity.",
  "Approved style: cinematic anime with restrained realism, detailed painterly rendering, natural cloth, skin, and hair texture, soft volumetric light, raytraced reflections, and high-end game/anime key-art polish.",
  "Avoid plasticky, chibi, cartoony, toy-like, over-smoothed, flat-color, generic AI-anime, muddy shadows, blur, grain, gore, extra limbs, distorted hands, cropped faces, cropped hands, text, logos, and watermarks.",
].join(" ");

const characterFiles = {
  haru: "Haru.webp",
  elira: "Elira.webp",
  aira: "Aira.webp",
  rhea: "Rhea.webp",
  lucien: "Lucien.webp",
  cael: "Cael.webp",
  mira: "Mira.webp",
  leon: "Leon.webp",
  liora: "Liora.webp",
  nera: "Nera.webp",
  cassian: "Cassian.webp",
  darian: "Darian.webp",
  halden: "Halden.webp",
  valen: "Valen.webp",
  finn: "Finn.webp",
  senna: "Senna.webp",
  soren: "Soren.webp",
  talen: "Talen.webp",
};

const coverSpecs = [
  {
    episode: "21",
    title: "The Spell Noctis Buried",
    prompt: "Create a wide 1536x960 cover for Black Circle Episode 21, The Spell Noctis Buried. The team stands in a moonlit old Aurelis archive as an amber witness-record remnant of Liora Aerlen-Valen rises from a damaged page; Haru and Elira face the record with controlled fear, while black Noctis notation and a pale Votive Return sigil coil through the shelves. Elira's pendant glows at her throat. Keep the mystery, restraint, and forbidden doctrine readable in one cinematic composition; no title text.",
  },
  {
    episode: "22",
    title: "The Field That Learned to Bleed",
    prompt: "Create a wide 1536x960 cover for Black Circle Episode 22, The Field That Learned to Bleed. In Aurelis's activity field, Elira stands at the center with her pendant flaring black and gold as black windows fracture around her; Haru holds back a restrained Black Circle at the edge, Leon grounds Cael, and Rhea's red emergency seal cuts across the field. Show a dangerous autonomy test becoming a trap, with clean dramatic geometry and no title text.",
  },
  {
    episode: "23",
    title: "The Clause That Smiled",
    prompt: "Create a wide 1536x960 cover for Black Circle Episode 23, The Clause That Smiled. Elira stands in a healer record room while a polite golden-white Noctis clause forms a smiling legal blade around her pendant; Haru watches with terrifying restraint, Nera and Aira work the witness seals behind them, and Lucien appears only as a fractured black-glass reflection. Elegant danger, pale paper, black geometry, warm gold light, no title text.",
  },
  {
    episode: "24",
    title: "The Second Hinge",
    prompt: "Create a wide 1536x960 cover for Black Circle Episode 24, The Second Hinge. Beneath an old Aurelis chapel, seven luminous handprints circle a damaged Witness Restoration pool; Haru, Elira, Cael, Mira, and Nera stand around it as the old record reveals that saving someone can be made into a wound. Silver water, black Noctis seams, green and gold witness light, solemn faces, physical mystery, no title text.",
  },
  {
    episode: "25",
    title: "Wounded City Protocol",
    prompt: "Create a wide 1536x960 cover for Black Circle Episode 25, Wounded City Protocol. A broken magical city opens beneath Aurelis with seven wounded markers and glowing witness rails; Elira steps toward an empty seventh marker as a black return hook reaches for her, Haru braces at the edge of a restrained Black Circle, and Cael's presence is implied by the threatened route. Dramatic rescue action, clean readable silhouettes, black, white, gold, and violet magic, no title text.",
  },
];

const scenePattern = /src:\s*"(assets\/scenes\/(episode-(?:21|22|23|24|25)-[^\"]+\.webp))",\s*alt:\s*"((?:\\.|[^\"])*)"/g;
const sceneJobs = [];
for (const match of buildSite.matchAll(scenePattern)) {
  const [, relativeSrc, basename, altRaw] = match;
  const alt = JSON.parse(`"${altRaw}"`);
  const episode = basename.match(/^episode-(\d+)/)[1];
  const lower = alt.toLowerCase();
  const refs = Object.entries(characterFiles)
    .filter(([name]) => lower.includes(name) || (name === "elira" && lower.includes("pendant")))
    .map(([, file]) => file);
  if (!refs.includes("Haru.webp") && lower.includes("haru")) refs.push("Haru.webp");
  if (!refs.includes("Elira.webp") && lower.includes("elira")) refs.push("Elira.webp");
  sceneJobs.push({
    id: basename.replace(/\.webp$/, ""),
    episode,
    relativeSrc,
    prompt: `${shared} Asset type: Black Circle Episode ${episode} scene illustration. Scene request: ${alt}. Use local character references ${refs.length ? refs.join(", ") : "for any named character in the scene"} from C:\\STORY\\SOURCE OF TRUTH CHARACTER FEATURES. Composition: wide landscape 1920x1080, cinematic story-reader frame, generous margins, clear faces and hands, no readable text. Preserve the scene's stated action and do not add characters or props not implied by the request.`,
  });
}

if (sceneJobs.length !== 50) {
  throw new Error(`Expected 50 Episode 21-25 scene entries in build-site.mjs; found ${sceneJobs.length}.`);
}

const jobs = [
  ...coverSpecs.map((spec) => ({
    id: `episode-${spec.episode}-cover`,
    episode: spec.episode,
    relativeSrc: `assets/episodes/episode-${spec.episode}-cover.webp`,
    prompt: `${shared} Asset type: Black Circle Episode ${spec.episode} cover art. ${spec.prompt} Match the wide cover framing used by the other source-of-truth episode covers. Keep all important characters and symbols fully inside frame.`,
  })),
  ...sceneJobs,
];

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      ...options,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

async function generateJob(job) {
  const outDir = path.join(runRoot, job.id);
  fs.mkdirSync(outDir, { recursive: true });
  const existing = path.join(outDir, "image-0001.png");
  if (!fs.existsSync(existing)) {
    const result = await run(exe, ["generate", job.prompt, "--out", outDir]);
    if (result.code !== 0 || !fs.existsSync(existing)) {
      const detail = (result.stderr || result.stdout).trim().slice(-1200);
      throw new Error(`${job.id} failed (exit ${result.code}): ${detail}`);
    }
  }
  return { ...job, generated: existing };
}

async function mapWithConcurrency(items, limit) {
  const results = [];
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      const job = items[index];
      process.stdout.write(`Generating ${index + 1}/${items.length}: ${job.id}\n`);
      results[index] = await generateJob(job);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

function convertToWebp(input, output, size) {
  return run("magick", [input, "-auto-orient", "-resize", `${size}^`, "-gravity", "center", "-extent", size, "-quality", "90", output]);
}

fs.mkdirSync(runRoot, { recursive: true });
const generated = await mapWithConcurrency(jobs, 2);
for (const job of generated) {
  const destination = path.join(projectRoot, job.relativeSrc);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const size = job.id.endsWith("-cover") ? "1536x960" : "1920x1080";
  const result = await convertToWebp(job.generated, destination, size);
  if (result.code !== 0 || !fs.existsSync(destination)) {
    throw new Error(`Failed to publish ${job.relativeSrc}: ${(result.stderr || result.stdout).trim().slice(-1200)}`);
  }
}

const build = await run("node", ["build-site.mjs"]);
if (build.code !== 0) {
  throw new Error(`Site rebuild failed: ${(build.stderr || build.stdout).trim().slice(-1200)}`);
}

process.stdout.write(`Generated and published ${generated.length} assets; rebuilt index.html.\n`);

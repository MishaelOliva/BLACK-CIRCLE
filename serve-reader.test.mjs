import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import test from "node:test";

const port = 4197;

test("reader serves index and rejects traversal", async (t) => {
	const child = spawn(process.execPath, ["serve-reader.mjs"], {
		cwd: process.cwd(),
		env: { ...process.env, BLACK_CIRCLE_READER_PORT: String(port) },
		stdio: ["ignore", "pipe", "pipe"],
	});

	t.after(() => child.kill());

	await new Promise((resolve, reject) => {
		const timeout = setTimeout(
			() => reject(new Error("reader did not start")),
			3000,
		);
		child.stdout.on("data", (chunk) => {
			if (chunk.toString().includes("running")) {
				clearTimeout(timeout);
				resolve();
			}
		});
		child.once("error", reject);
		child.once("exit", (code) => {
			if (code !== null) reject(new Error(`reader exited with ${code}`));
		});
	});

	const index = await fetch(`http://127.0.0.1:${port}/index.html`);
	assert.equal(index.status, 200);

	const traversal = await new Promise((resolve, reject) => {
		const request = http.request(
			{ hostname: "127.0.0.1", port, path: "/%2e%2e/%2e%2e/AGENTS.md" },
			(response) => {
				response.resume();
				response.once("end", () => resolve(response));
			},
		);
		request.once("error", reject);
		request.end();
	});
	assert.equal(traversal.statusCode, 403);
});

test("sentence highlight markup, builder output, and CSS assets are present", async () => {
  const fs = await import("node:fs/promises");
  const [html, css] = await Promise.all([
    fs.readFile(new URL("./index.html", import.meta.url), "utf8"),
    fs.readFile(new URL("./assets/ui/black-circle-overhaul.css", import.meta.url), "utf8")
  ]);

  assert.match(html, /id="jumpHighlightButton"/);
  assert.match(html, /blackCircleHighlightedSentences/);
  assert.match(html, /function wrapSentencesHtml\(/);
  assert.match(html, /function toggleSentenceHighlight\(/);
  assert.match(html, /function jumpToHighlightedSentence\(/);
  assert.match(html, /addEventListener\("touchend"/);
  assert.match(html, /addEventListener\("dblclick"/);

  assert.match(css, /\.story-sentence\s*\{[\s\S]*display:\s*inline/);
  assert.match(css, /\.story-sentence\.is-highlighted\b/);
  assert.match(css, /\.reader-tool-button\.has-highlight\b/);
});

test("wrapSentencesHtml splits sentences safely and keeps all 35 built episodes tag-balanced", async () => {
  const fs = await import("node:fs/promises");
  const vm = await import("node:vm");
  const [html, contentJs] = await Promise.all([
    fs.readFile(new URL("./index.html", import.meta.url), "utf8"),
    fs.readFile(new URL("./assets/data/reader-content.js", import.meta.url), "utf8")
  ]);

  const start = html.indexOf("    function wrapSentencesHtml(");
  const end = html.indexOf("    function renderEpisode(", start);
  assert.ok(start !== -1 && end !== -1, "wrapSentencesHtml and renderBody must exist in built index.html");

  const mdStart = html.indexOf("    function markdownInline(");
  const mdEnd = html.indexOf("\n\n    const frameThemes", mdStart);
  assert.ok(mdStart !== -1 && mdEnd !== -1, "markdownInline and escapeHtml must exist in built index.html");
  const helperCode = html.slice(mdStart, mdEnd);
  const bodyCode = html.slice(start, end);

  const dataCtx = vm.createContext({ globalThis: {} });
  vm.runInContext(contentJs, dataCtx);
  const { episodes } = dataCtx.globalThis.BLACK_CIRCLE_CONTENT;
  assert.equal(episodes.length, 35);

  const context = vm.createContext({});
  vm.runInContext(
    `${helperCode}\nfunction speakerKey(s){return s.toLowerCase();}\n${bodyCode}\nthis.wrapSentencesHtml = wrapSentencesHtml;\nthis.renderBody = renderBody;`,
    context
  );

  const counter = { value: 0 };
  const plain = context.wrapSentencesHtml("First sentence here. Second sentence follows!", "ep1", counter);
  assert.equal(
    plain,
    '<span class="story-sentence" data-sentence-id="ep1-s0">First sentence here.</span> <span class="story-sentence" data-sentence-id="ep1-s1">Second sentence follows!</span>'
  );

  const formatted = context.wrapSentencesHtml("<em>A Green scored. Leon lost.</em>", "ep1", { value: 0 });
  assert.equal(
    formatted,
    '<span class="story-sentence" data-sentence-id="ep1-s0"><em>A Green scored.</em></span> <span class="story-sentence" data-sentence-id="ep1-s1"><em>Leon lost.</em></span>'
  );

  const abbrAndDialogue = context.wrapSentencesHtml(
    'Mr. Varek ran 1.5 miles. "Wait?" she asked. Next sentence.',
    "ep2",
    { value: 0 }
  );
  const ids = [...abbrAndDialogue.matchAll(/data-sentence-id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, ["ep2-s0", "ep2-s1", "ep2-s2"]);

  for (const episode of episodes) {
    const rendered = context.renderBody(episode.body, episode.scenes || [], episode.id);
    assert.equal(
      (rendered.match(/<span\b/g) || []).length,
      (rendered.match(/<\/span>/g) || []).length,
      `${episode.id} rendered <span> tags must stay balanced`
    );
    assert.equal(
      (rendered.match(/<em\b/g) || []).length,
      (rendered.match(/<\/em>/g) || []).length,
      `${episode.id} rendered <em> tags must stay balanced`
    );
    assert.equal(
      (rendered.match(/<strong\b/g) || []).length,
      (rendered.match(/<\/strong>/g) || []).length,
      `${episode.id} rendered <strong> tags must stay balanced`
    );
    if (episode.id === "ep1") {
      assert.equal((rendered.match(/class="scene-anchor"/g) || []).length, 21);
    }
  }
});

test("highlight toggle, single-per-episode replacement, clear, and jump button state transitions", async () => {
  const fs = await import("node:fs/promises");
  const vm = await import("node:vm");
  const html = await fs.readFile(new URL("./index.html", import.meta.url), "utf8");

  const fnStart = html.indexOf("    function readHighlightsMap()");
  const fnEnd = html.indexOf("    function downloadArchiveText()", fnStart);
  assert.ok(fnStart !== -1 && fnEnd !== -1, "Highlight management functions must exist in built index.html");
  const highlightCode = html.slice(fnStart, fnEnd);

  const storage = new Map();
  let scrolledToId = "";
  let pulsed = false;
  let scheduledProgress = false;
  function makeClassList(initial = []) {
    const set = new Set(initial);
    return {
      add: (...cls) => cls.forEach((c) => set.add(c)),
      remove: (...cls) => cls.forEach((c) => set.delete(c)),
      toggle: (c, force) => (force ? set.add(c) : set.delete(c)),
      contains: (c) => set.has(c)
    };
  }
  const s0 = {
    dataset: { sentenceId: "ep1-s0" },
    textContent: "My quiet magic slept.",
    attrs: {},
    setAttribute(k, v) { this.attrs[k] = v; },
    removeAttribute(k) { delete this.attrs[k]; },
    classList: makeClassList(),
    offsetWidth: 100,
    getBoundingClientRect: () => ({ top: 200, height: 24 }),
    scrollIntoView: () => { scrolledToId = "ep1-s0"; },
    closest: (sel) => (sel === ".story-sentence" ? s0 : null)
  };
  const s1 = {
    dataset: { sentenceId: "ep1-s1" },
    textContent: "Nobody looked twice.",
    attrs: {},
    setAttribute(k, v) { this.attrs[k] = v; },
    removeAttribute(k) { delete this.attrs[k]; },
    classList: makeClassList(),
    offsetWidth: 100,
    getBoundingClientRect: () => ({ top: 300, height: 24 }),
    scrollIntoView: () => { scrolledToId = "ep1-s1"; },
    closest: (sel) => (sel === ".story-sentence" ? s1 : null)
  };
  const nodes = [s0, s1];
  const jumpBtn = {
    disabled: true,
    title: "",
    textContent: "Jump to Highlight",
    attrs: {},
    setAttribute(k, v) { this.attrs[k] = v; },
    classList: makeClassList()
  };
  const readerStatus = { textContent: "" };

  const context = vm.createContext({
    EPISODES: [{ id: "ep1", title: "Ep 1" }, { id: "ep2", title: "Ep 2" }],
    currentEpisodeIndex: 0,
    highlightSentenceKey: "blackCircleHighlightedSentences",
    jumpHighlightButton: jumpBtn,
    readerStatus,
    scheduleScrollProgressUpdate: () => { scheduledProgress = true; },
    reader: {
      querySelectorAll: (sel) => (sel.includes("is-highlighted") ? nodes.filter((n) => n.classList.contains("is-highlighted")) : nodes),
      querySelector: (sel) => {
        const m = sel.match(/data-sentence-id="([^"]+)"/);
        return m ? nodes.find((n) => n.dataset.sentenceId === m[1]) || null : null;
      }
    },
    localStorage: {
      getItem: (k) => (storage.has(k) ? storage.get(k) : null),
      setItem: (k, v) => storage.set(k, String(v))
    },
    CSS: { escape: (v) => v },
    window: {
      innerHeight: 800,
      matchMedia: () => ({ matches: false }),
      setTimeout: (fn) => { pulsed = true; fn(); }
    }
  });

  vm.runInContext(
    `${highlightCode}\nthis.toggleSentenceHighlight = toggleSentenceHighlight;\nthis.jumpToHighlightedSentence = jumpToHighlightedSentence;\nthis.applyEpisodeHighlight = applyEpisodeHighlight;`,
    context
  );

  assert.equal(jumpBtn.disabled, true);
  context.toggleSentenceHighlight(s0);
  assert.equal(s0.classList.contains("is-highlighted"), true);
  assert.equal(s1.classList.contains("is-highlighted"), false);
  assert.equal(jumpBtn.disabled, false);

  context.jumpToHighlightedSentence();
  assert.equal(scrolledToId, "ep1-s0");
  assert.equal(pulsed, true);
  assert.equal(scheduledProgress, true);

  context.toggleSentenceHighlight(s1);
  assert.equal(s0.classList.contains("is-highlighted"), false);
  assert.equal(s1.classList.contains("is-highlighted"), true);
  assert.equal(jumpBtn.disabled, false);

  context.toggleSentenceHighlight(s1);
  assert.equal(s1.classList.contains("is-highlighted"), false);
  assert.equal(jumpBtn.disabled, true);
});

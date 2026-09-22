import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const episodesDir = path.join(root, "episodes");
const archiveRoot = path.join(root, "archived-episodes");
let sourceEpisodesDir = episodesDir;

const longFormMap = [
	{ out: 1, title: "The Green Circle Transfer Student", sources: ["1", "2"] },
	{ out: 2, title: "A Quiet Humiliation", sources: ["3", "4"] },
	{ out: 3, title: "Rumors Under Sunlight", sources: ["5", "6"] },
	{ out: 4, title: "The Shape of a Team", sources: ["7", "8"] },
	{ out: 5, title: "The Opening Fault", sources: ["9", "10"] },
	{ out: 6, title: "The Record That Knew Him", sources: ["11"] },
	{ out: 7, title: "Talen Speaks", sources: ["12", "13"] },
	{ out: 8, title: "The Autonomy Proof", sources: ["14"] },
	{ out: 9, title: "The Spell Noctis Buried", sources: ["15", "16"] },
	{ out: 10, title: "The Clause That Smiled", sources: ["17", "18"] },
	{ out: 11, title: "Wounded City Protocol", sources: ["19"] },
	{ out: 12, title: "The Night Before the Cut", sources: ["20", "21"] },
	{ out: 13, title: "The Black Circle Unbound", sources: ["22"] },
	{ out: 14, title: "The Vigil", sources: ["23", "24"] },
	{ out: 15, title: "The Room Where She Woke Twice", sources: ["25", "26"] },
	{ out: 16, title: "The Quiet Place", sources: ["27", "28"] },
	{ out: 17, title: "Fear Has a Shape", sources: ["29"] },
	{ out: 18, title: "The Vow After Death", sources: ["30", "30.5"] },
	{
		out: 19,
		title: "The First Hearing",
		sources: ["31", "32"],
		endBefore: "\n---\n\nThe sound inside Elira",
	},
	{
		out: 20,
		title: "The Trial of Proximity",
		sources: ["31", "32"],
		startAt: "The sound inside Elira",
	},
	{ out: 21, title: "Return to the Academy", sources: ["33", "34"] },
	{ out: 22, title: "The Boy Beneath the School", sources: ["35", "36"] },
	{ out: 23, title: "Green Circle Witnesses", sources: ["37"] },
	{ out: 24, title: "When Restraint Breaks the Floor", sources: ["38", "39"] },
	{ out: 25, title: "No Throne for the Black Circle", sources: ["40", "41"] },
	{ out: 26, title: "The Weight of a Copper", sources: ["42", "43"] },
	{ out: 27, title: "The Hand That Was Not Taken", sources: ["44", "45"] },
	{ out: 28, title: "The First Bell After Rescue", sources: ["46"] },
];

function readEpisode(number) {
	const file = path.join(sourceEpisodesDir, `EPISODE ${number}.txt`);
	return fs
		.readFileSync(file, "utf8")
		.replace(/^\uFEFF/, "")
		.replace(/\r\n/g, "\n")
		.trim();
}

function extractTitle(text, fallback) {
	const heading = text.match(
		/^#\s*Episode\s+[\d.]+:\s*(?:\*\*)?(.+?)(?:\*\*)?\s*$/m,
	);
	return heading ? heading[1].trim() : fallback;
}

function stripTopHeading(text) {
	return text
		.replace(/^#\s*Episode\s+[\d.]+:\s*(?:\*\*)?.+?(?:\*\*)?\s*$(?:\n+)?/m, "")
		.trim();
}

function wordCount(text) {
	return (text.match(/\b[\w'-]+\b/g) || []).length;
}

function archiveCurrentEpisodes() {
	const currentEpisodes = fs
		.readdirSync(episodesDir)
		.filter((entry) => /^EPISODE .+\.txt$/i.test(entry));

	if (!currentEpisodes.length) {
		const latestArchive = fs
			.readdirSync(archiveRoot, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => path.join(archiveRoot, entry.name))
			.filter((dir) => fs.existsSync(path.join(dir, "EPISODE 1.txt")))
			.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];

		if (!latestArchive) {
			throw new Error(
				"No current episode files and no non-empty episode archive found.",
			);
		}
		return latestArchive;
	}

	fs.mkdirSync(archiveRoot, { recursive: true });
	const stamp = new Date()
		.toISOString()
		.replace(/[-:]/g, "")
		.replace(/\.\d+Z$/, "Z");
	const archiveDir = path.join(archiveRoot, `v3-before-longform-${stamp}`);
	fs.mkdirSync(archiveDir, { recursive: true });

	for (const entry of currentEpisodes) {
		fs.copyFileSync(
			path.join(episodesDir, entry),
			path.join(archiveDir, entry),
		);
	}

	return archiveDir;
}

function buildCombinedEpisode(item) {
	const parts = item.sources.map((source, index) => {
		const raw = readEpisode(source);
		const body = stripTopHeading(raw);
		return body;
	});

	const header = [`# Episode ${item.out}: **${item.title}**`, ""].join("\n");

	let body = parts.join("\n\n---\n\n");
	if (item.endBefore) {
		const index = body.indexOf(item.endBefore);
		if (index < 0)
			throw new Error(`Missing split end marker for Episode ${item.out}`);
		body = body.slice(0, index).trimEnd();
	}
	if (item.startAt) {
		const index = body.indexOf(item.startAt);
		if (index < 0)
			throw new Error(`Missing split start marker for Episode ${item.out}`);
		body = body.slice(index).trimStart();
	}

	return `${header}${body}\n`;
}

const archiveDir = archiveCurrentEpisodes();
sourceEpisodesDir = archiveDir;

for (const entry of fs.readdirSync(episodesDir)) {
	if (/^EPISODE .+\.txt$/i.test(entry)) {
		fs.rmSync(path.join(episodesDir, entry));
	}
}

const report = [];
for (const item of longFormMap) {
	const combined = buildCombinedEpisode(item);
	const file = path.join(episodesDir, `EPISODE ${item.out}.txt`);
	fs.writeFileSync(file, combined, "utf8");
	report.push({
		episode: item.out,
		sources: item.sources.join("+"),
		words: wordCount(combined),
	});
}

console.log(`Archived previous episodes: ${path.relative(root, archiveDir)}`);
console.table(report);

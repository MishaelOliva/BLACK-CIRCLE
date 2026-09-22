import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const episodesDir = path.join(root, "episodes");
const episodeFiles = fs
	.readdirSync(episodesDir)
	.filter((name) => /^EPISODE \d+\.txt$/i.test(name))
	.sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const canonicalSurnames = new Map([
	["Haru", "Aerlen"],
	["Elira", "Vale"],
	["Aira", "Solen"],
	["Leon", "Varek"],
	["Cassian", "Veyr"],
	["Cael", "Nox"],
	["Rhea", "Valmont"],
	["Lucien", "Voss"],
	["Nera", "Vail"],
	["Soren", "Ashvale"],
	["Mira", "Castellan"],
	["Iris", "Valen"],
	["Talen", "Mire"],
	["Darian", "Thorne"],
	["Liora", "Aerlen-Valen"],
	["Mara", "Kest"],
	["Finn", "Castellan"],
	["Senna", "Voss"],
]);
const castNameCandidatePattern = new RegExp(
	`\\b(${[...canonicalSurnames.keys()].join("|")})\\s+([A-Z][A-Za-z-]+)\\b`,
	"g",
);
const knownNameDriftPattern =
	/\b(?:Finn Arlet|Cassian Dray|Oric Venn|Soren Vale|Soren Veyr|Darian Vale|Leon Ardent)\b/g;
const nameAuditFiles = [
	"START HERE.txt",
	"STORY-SPINE.md",
	"CONTINUITY-BIBLE.md",
	"EPISODE-QUALITY-CHECKLIST.md",
	...episodeFiles.map((file) => path.join("episodes", file)),
];

const artifactPattern =
	/Long-form revision assembly|V3 Episode|Revision rule|Source Text|^## Part \d+:/im;
const weakEndingPattern =
	/\b(uncertain|full of questions|questions no one|day ended|would have to|only time would tell)\b/i;
const genericEmotionPattern =
	/\b(felt afraid|felt sad|felt complicated|felt confused|felt happy|felt angry|felt anxious|felt overwhelmed)\b/i;
const notLinePattern = /^Not\b/gm;
const noLinePattern = /^No\b/gm;
const thatWasLinePattern = /^That was\b/gm;
const wentStillPattern = /\bwent (?:very )?still\b/gi;
const standaloneYesPattern = /^\w+:\s*"Yes\."$/gm;
const pendantPattern = /\bpendant\b/gi;
const technicalTerms =
	/\b(protocol|classification|structure|system|relay|witness|doctrine|Foundation|Council|containment|route|sequence|compatibility|authority|asset|threat|precedent)\b/gi;
const physicalAnchors =
	/\b(hand|hands|finger|fingers|breath|chest|pulse|voice|eyes|mouth|stone|floor|wall|ink|paper|pen|sleeve|collar|throat|wrist|light|cold|warm|rain|sound|blood)\b/i;

function wordCount(text) {
	return (text.match(/\b[\w'-]+\b/g) || []).length;
}

function paragraphMetrics(text) {
	const paragraphs = text
		.split(/\n{2,}/)
		.map((paragraph) => paragraph.trim())
		.filter((paragraph) => paragraph && !/^#{1,6}\s|^---$/.test(paragraph));
	const counts = paragraphs.map((paragraph) => wordCount(paragraph));
	return {
		paragraphs: paragraphs.length,
		oneWordParagraphs: counts.filter((count) => count === 1).length,
		shortParagraphs: counts.filter((count) => count <= 4).length,
	};
}

function outsideEpisodeShape(words) {
	const breather = words >= 7_500 && words <= 8_500;
	const standard = words >= 8_000 && words <= 11_000;
	const pairedCenterpiece = words >= 10_000 && words <= 12_000;
	return !(breather || standard || pairedCenterpiece);
}

function firstStoryLines(lines) {
	const start = lines.findIndex((line) => /^# /.test(line));
	return lines
		.slice(start + 1)
		.filter((line) => line.trim() && !line.startsWith(">"))
		.slice(0, 10);
}

function lastStoryLines(lines) {
	return lines.filter((line) => line.trim()).slice(-8);
}

function lineCount(text) {
	return text.split("\n").length;
}

function technicalDriftCount(text) {
	return text.split(/\n{2,}/).filter((paragraph) => {
		const terms = paragraph.match(technicalTerms) || [];
		return terms.length >= 3 && !physicalAnchors.test(paragraph);
	}).length;
}

function findEliraInterludes(text) {
	return /^## .*Elira|^## Interlude:.*Choice|^## Interlude:.*Answer/im.test(
		text,
	);
}

function countNotClusters(lines) {
	let clusters = 0;
	for (let index = 0; index < lines.length; index += 1) {
		const window = lines.slice(index, index + 12);
		const notLines = window.filter((line) => /^Not\b/.test(line.trim())).length;
		if (notLines >= 3) clusters += 1;
	}
	return clusters;
}

function findCanonicalNameFailures() {
	const failures = [];
	for (const relativeFile of nameAuditFiles) {
		const lines = fs
			.readFileSync(path.join(root, relativeFile), "utf8")
			.replace(/\r\n/g, "\n")
			.split("\n");
		for (let index = 0; index < lines.length; index += 1) {
			const line = lines[index];
			if (/^\s*(?:#|\*\*|```)/.test(line)) continue;
			for (const match of line.matchAll(castNameCandidatePattern)) {
				const expectedSurname = canonicalSurnames.get(match[1]);
				if (match[2] !== expectedSurname) {
					failures.push(
						`${relativeFile}:${index + 1} ${match[0]} -> ${match[1]} ${expectedSurname}`,
					);
				}
			}
		}
	}

	const siteLines = fs
		.readFileSync(path.join(root, "build-site.mjs"), "utf8")
		.replace(/\r\n/g, "\n")
		.split("\n");
	for (let index = 0; index < siteLines.length; index += 1) {
		for (const match of siteLines[index].matchAll(knownNameDriftPattern)) {
			failures.push(`build-site.mjs:${index + 1} forbidden variant ${match[0]}`);
		}
	}
	return failures;
}

const results = [];
let artifactFailures = 0;
const eliraEpisodes = [];
const canonicalNameFailures = findCanonicalNameFailures();

for (const file of episodeFiles) {
	const number = Number(file.match(/\d+/)[0]);
	const text = fs
		.readFileSync(path.join(episodesDir, file), "utf8")
		.replace(/\r\n/g, "\n");
	const lines = text.split("\n");
	const opening = firstStoryLines(lines).join(" / ");
	const ending = lastStoryLines(lines).join(" / ");
	const hasArtifact = artifactPattern.test(text);
	const hasEliraInterlude = findEliraInterludes(text);
	const paragraphStats = paragraphMetrics(text);
	if (hasArtifact) artifactFailures += 1;
	if (hasEliraInterlude) eliraEpisodes.push(number);

	results.push({
		ep: number,
		words: wordCount(text),
		lines: lineCount(text),
		hook: opening.slice(0, 120),
		endingFlag: weakEndingPattern.test(ending),
		genericEmotionHits: (text.match(genericEmotionPattern) || []).length,
		technicalDriftParagraphs: technicalDriftCount(text),
		notLines: (text.match(notLinePattern) || []).length,
		noLines: (text.match(noLinePattern) || []).length,
		thatWasLines: (text.match(thatWasLinePattern) || []).length,
		notClusters: countNotClusters(lines),
		wentStill: (text.match(wentStillPattern) || []).length,
		standaloneYes: (text.match(standaloneYesPattern) || []).length,
		pendant: (text.match(pendantPattern) || []).length,
		eliraInterlude: hasEliraInterlude,
		artifact: hasArtifact,
		shapeWarning: outsideEpisodeShape(wordCount(text)),
		...paragraphStats,
	});
}

const lineWarnings = results.filter(
	(item) => item.lines < 1800 || item.lines > 2500,
);
const endingWarnings = results.filter((item) => item.endingFlag);
const driftWarnings = results.filter(
	(item) => item.technicalDriftParagraphs > 0,
);
const emotionWarnings = results.filter((item) => item.genericEmotionHits > 0);
const notClusterWarnings = results.filter((item) => item.notClusters > 0);
const shapeWarnings = results.filter((item) => item.shapeWarning);

const eliraGaps = [];
let previous = 0;
for (const current of eliraEpisodes) {
	if (previous && current - previous > 5) {
		eliraGaps.push(`${previous}->${current}`);
	}
	previous = current;
}

console.log(`episodes=${results.length}`);
console.log(`artifact_failures=${artifactFailures}`);
console.log(`canonical_name_failures=${canonicalNameFailures.length}`);
console.log(`line_range_warnings=${lineWarnings.length}`);
console.log(`weak_ending_warnings=${endingWarnings.length}`);
console.log(`technical_drift_warnings=${driftWarnings.length}`);
console.log(`generic_emotion_warnings=${emotionWarnings.length}`);
console.log(`not_cluster_warnings=${notClusterWarnings.length}`);
console.log(`episode_shape_warnings=${shapeWarnings.length}`);
console.log(
	`total_not_lines=${results.reduce((sum, item) => sum + item.notLines, 0)}`,
);
console.log(
	`total_no_lines=${results.reduce((sum, item) => sum + item.noLines, 0)}`,
);
console.log(
	`total_that_was_lines=${results.reduce((sum, item) => sum + item.thatWasLines, 0)}`,
);
console.log(
	`short_paragraphs=${results.reduce((sum, item) => sum + item.shortParagraphs, 0)}/${results.reduce((sum, item) => sum + item.paragraphs, 0)}`,
);
console.log(
	`one_word_paragraphs=${results.reduce((sum, item) => sum + item.oneWordParagraphs, 0)}`,
);
console.log(
	`total_went_still=${results.reduce((sum, item) => sum + item.wentStill, 0)}`,
);
console.log(
	`total_standalone_yes=${results.reduce((sum, item) => sum + item.standaloneYes, 0)}`,
);
console.log(
	`total_pendant_mentions=${results.reduce((sum, item) => sum + item.pendant, 0)}`,
);
console.log(`elira_interludes=${eliraEpisodes.join(",") || "none"}`);
console.log(`elira_gaps_over_5=${eliraGaps.join(",") || "none"}`);

if (canonicalNameFailures.length) {
	console.log("\nCanonical name failures:");
	for (const failure of canonicalNameFailures) console.log(failure);
}

console.log("\nAdvisory detail:");
for (const item of results) {
	const notes = [];
	if (item.lines < 1800 || item.lines > 2500) notes.push(`lines=${item.lines}`);
	if (item.shapeWarning) notes.push(`words=${item.words}`);
	if (item.endingFlag) notes.push("ending");
	if (item.technicalDriftParagraphs)
		notes.push(`technical=${item.technicalDriftParagraphs}`);
	if (item.genericEmotionHits) notes.push(`emotion=${item.genericEmotionHits}`);
	if (item.notClusters) notes.push(`notClusters=${item.notClusters}`);
	if (item.shortParagraphs / item.paragraphs > 0.4)
		notes.push(`shortParas=${item.shortParagraphs}/${item.paragraphs}`);
	if (item.wentStill > 2) notes.push(`wentStill=${item.wentStill}`);
	if (item.standaloneYes > 12) notes.push(`yes=${item.standaloneYes}`);
	if (item.pendant > 12) notes.push(`pendant=${item.pendant}`);
	if (item.artifact) notes.push("artifact");
	if (notes.length) {
		console.log(`EP ${item.ep}: ${notes.join(" ")}`);
	}
}

if (artifactFailures || canonicalNameFailures.length) {
	process.exitCode = 1;
}

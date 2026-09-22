import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
import { chromium } from "playwright-core";

const root = process.cwd();
const bravePath =
	"C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe";
const screenshotDir = path.join(root, "tmp", "screenshots");
fs.mkdirSync(screenshotDir, { recursive: true });

const port = 4174;

async function ensureServer() {
	const isUp = await new Promise((resolve) => {
		http
			.get(`http://127.0.0.1:${port}/index.html`, (res) =>
				resolve(res.statusCode === 200),
			)
			.on("error", () => resolve(false));
	});
	if (isUp) {
		console.log(`Using active server on port ${port}`);
		return null;
	}
	console.log(`Starting server on port ${port}...`);
	const child = spawn(process.execPath, ["serve-reader.mjs"], {
		cwd: root,
		env: { ...process.env, BLACK_CIRCLE_READER_PORT: String(port) },
		stdio: ["ignore", "pipe", "pipe"],
	});
	await new Promise((resolve, reject) => {
		const timeout = setTimeout(() => resolve(), 3000);
		child.stdout?.on("data", (chunk) => {
			if (chunk.toString().includes("running")) {
				clearTimeout(timeout);
				resolve();
			}
		});
		child.once("error", reject);
	});
	return child;
}

async function capture() {
	const server = await ensureServer();

	console.log("Launching browser from", bravePath);
	const browser = await chromium.launch({
		executablePath: bravePath,
		headless: true,
		args: ["--no-sandbox", "--disable-gpu"],
	});

	try {
		const baseUrl = `http://127.0.0.1:${port}/index.html`;

		// 1. Desktop Dark Landing
		console.log("Capturing 1. Desktop Dark Landing...");
		let page = await browser.newPage({
			viewport: { width: 1440, height: 900 },
		});
		await page.goto(baseUrl, { waitUntil: "networkidle" });
		await page.evaluate(() => localStorage.setItem("blackCircleTheme", "dark"));
		await page.reload({ waitUntil: "networkidle" });
		await page.waitForTimeout(600);
		await page.screenshot({
			path: path.join(screenshotDir, "01-landing-desktop-dark.png"),
		});

		// 2. Desktop Light Landing
		console.log("Capturing 2. Desktop Light Landing...");
		const landingThemeBtn = page.locator("#landingThemeToggle").first();
		if (await landingThemeBtn.isVisible()) {
			await landingThemeBtn.click();
			await page.waitForTimeout(500);
			await page.screenshot({
				path: path.join(screenshotDir, "02-landing-desktop-light.png"),
			});
		}
		await page.close();

		// 3. Mobile Landing (Dark & Light)
		console.log("Capturing 3. Mobile Landing Dark...");
		page = await browser.newPage({ viewport: { width: 390, height: 844 } });
		await page.goto(baseUrl, { waitUntil: "networkidle" });
		await page.evaluate(() => localStorage.setItem("blackCircleTheme", "dark"));
		await page.reload({ waitUntil: "networkidle" });
		await page.waitForTimeout(600);
		await page.screenshot({
			path: path.join(screenshotDir, "03-landing-mobile-dark.png"),
		});

		const mobileLandingAudit = await page.evaluate(() => {
			const nav = document.querySelector(".landing-nav");
			const brand = document.querySelector(".landing-brand");
			const actions = document.querySelector(".landing-nav-actions");
			const docWidth = document.documentElement.clientWidth;
			const scrollWidth = document.documentElement.scrollWidth;
			const hasHScroll = scrollWidth > docWidth;
			const bRect = brand?.getBoundingClientRect();
			const aRect = actions?.getBoundingClientRect();
			const overlap = bRect && aRect ? bRect.right > aRect.left : false;
			return {
				docWidth,
				scrollWidth,
				hasHScroll,
				brandRight: bRect?.right,
				actionsLeft: aRect?.left,
				overlap,
				margin: aRect && bRect ? aRect.left - bRect.right : null,
			};
		});
		console.log("Mobile Landing Nav Audit:", mobileLandingAudit);

		console.log("Capturing 3b. Mobile Landing Light...");
		const mobileLandingThemeBtn = page.locator("#landingThemeToggle").first();
		if (await mobileLandingThemeBtn.isVisible()) {
			await mobileLandingThemeBtn.click();
			await page.waitForTimeout(400);
			await page.screenshot({
				path: path.join(screenshotDir, "03b-landing-mobile-light.png"),
			});
		}
		await page.close();

		// 4. Reader View Desktop (Dark & Light)
		console.log("Capturing 4. Reader View Desktop Dark...");
		page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
		await page.goto(`${baseUrl}#ep1`, { waitUntil: "networkidle" });
		await page.evaluate(() => localStorage.setItem("blackCircleTheme", "dark"));
		await page.reload({ waitUntil: "networkidle" });
		await page.waitForTimeout(600);
		await page.screenshot({
			path: path.join(screenshotDir, "04-reader-desktop-ep1-dark.png"),
		});

		console.log("Auditing Episode 1 Cover Hero...");
		const coverAudit = await page.evaluate(() => {
			const hero = document.querySelector(".episode-cover-hero");
			const img = hero?.querySelector("img");
			const hRect = hero?.getBoundingClientRect();
			return {
				hasCover: Boolean(hero),
				imgLoaded: img?.complete && img?.naturalWidth > 0,
				src: img?.src,
				width: hRect?.width,
				height: hRect?.height,
			};
		});
		console.log("Cover Hero Audit:", coverAudit);

		// Comprehensive audit for all 11 scenes
		const sceneIds = [
			"scene-ep1-sunrise",
			"scene-ep1-arrival",
			"scene-ep1-whispers",
			"scene-ep1-lecture",
			"scene-ep1-black-circle-question",
			"scene-ep1-duel",
			"scene-ep1-duel-aftermath",
			"scene-ep1-rhea-notices",
			"scene-ep1-aira-tea",
			"scene-ep1-elira-lunch",
			"scene-ep1-elira-garden",
		];

		console.log("Auditing and capturing all 11 scenes...");
		for (const [idx, id] of sceneIds.entries()) {
			const loc = page.locator(`#${id}`);
			if (await loc.isVisible()) {
				await loc.scrollIntoViewIfNeeded();
				await page.waitForTimeout(250);
				await page.screenshot({
					path: path.join(screenshotDir, `05-scene-${String(idx + 1).padStart(2, "0")}-${id}.png`),
				});
			}
		}

		const fullScenesAudit = await page.evaluate((ids) => {
			const reader = document.querySelector(".reader");
			const rRect = reader?.getBoundingClientRect();
			const docWidth = document.documentElement.clientWidth;
			const scrollWidth = document.documentElement.scrollWidth;
			return ids.map((id) => {
				const anchor = document.getElementById(id);
				const callout = anchor?.querySelector(".scene-callout");
				const img = callout?.querySelector("img");
				const cRect = callout?.getBoundingClientRect();
				return {
					id,
					found: Boolean(anchor),
					imgLoaded: img?.complete && img?.naturalWidth > 0,
					naturalWidth: img?.naturalWidth,
					naturalHeight: img?.naturalHeight,
					isBesideReader: cRect && rRect ? cRect.left >= rRect.right - 10 : false,
					calloutLeft: cRect?.left,
					readerRight: rRect?.right,
					hasHScroll: scrollWidth > docWidth,
				};
			});
		}, sceneIds);
		console.log("All 11 Scenes Audit Summary:", JSON.stringify(fullScenesAudit, null, 2));

		console.log("Capturing 4b. Reader View Desktop Light & Cover Light...");
		const readerThemeBtn = page.locator("#themeToggle").first();
		if (await readerThemeBtn.isVisible()) {
			await readerThemeBtn.click();
			await page.waitForTimeout(400);
			await page.screenshot({
				path: path.join(screenshotDir, "04b-reader-desktop-ep1-light.png"),
			});
			const scene1 = page.locator("#scene-ep1-arrival");
			if (await scene1.isVisible()) {
				await scene1.scrollIntoViewIfNeeded();
				await page.waitForTimeout(300);
				await page.screenshot({
					path: path.join(screenshotDir, "05-scene1-desktop-light.png"),
				});
			}
		}
		await page.close();

		// 5. Reader View Mobile (Dark & Light)
		console.log("Capturing 5. Reader View Mobile Dark...");
		page = await browser.newPage({ viewport: { width: 390, height: 844 } });
		await page.goto(`${baseUrl}#ep1`, { waitUntil: "networkidle" });
		await page.evaluate(() => localStorage.setItem("blackCircleTheme", "dark"));
		await page.reload({ waitUntil: "networkidle" });
		await page.waitForTimeout(600);
		await page.screenshot({
			path: path.join(screenshotDir, "06-reader-mobile-ep1-dark.png"),
		});

		const mobileScene1 = page.locator("#scene-ep1-arrival");
		if (await mobileScene1.isVisible()) {
			await mobileScene1.scrollIntoViewIfNeeded();
			await page.waitForTimeout(400);
			await page.screenshot({
				path: path.join(screenshotDir, "06c-scene1-mobile-dark.png"),
			});
			const mobileScene1Audit = await page.evaluate(() => {
				const callout = document.querySelector("#scene-ep1-arrival .scene-callout");
				const cRect = callout?.getBoundingClientRect();
				const docWidth = document.documentElement.clientWidth;
				const scrollWidth = document.documentElement.scrollWidth;
				return {
					docWidth,
					scrollWidth,
					hasHScroll: scrollWidth > docWidth,
					calloutWidth: cRect?.width,
					calloutLeft: cRect?.left,
					fitsInScreen: cRect ? cRect.right <= docWidth : false,
				};
			});
			console.log("Mobile Scene 1 Audit:", mobileScene1Audit);
		}

		// Check collision on mobile reader
		const mobileHeaderAudit = await page.evaluate(() => {
			const brand = document.querySelector(".reader-brand");
			const brandText = brand?.querySelector("span:not(.reader-logo)");
			const themeBtn = document.querySelector("#themeToggle");
			const menuBtn = document.querySelector("#readerMenuButton");
			if (!brandText || !themeBtn) return { overlap: false };
			const bRect = brandText.getBoundingClientRect();
			const tRect = themeBtn.getBoundingClientRect();
			const overlap = bRect.right > tRect.left;
			return {
				brandTextRight: bRect.right,
				themeBtnLeft: tRect.left,
				overlap,
				margin: tRect.left - bRect.right,
			};
		});
		console.log("Mobile Header Collision Audit:", mobileHeaderAudit);

		console.log("Capturing 5b. Reader View Mobile Light...");
		const mobileReaderThemeBtn = page.locator("#themeToggle").first();
		if (await mobileReaderThemeBtn.isVisible()) {
			await mobileReaderThemeBtn.click();
			await page.waitForTimeout(400);
			await page.screenshot({
				path: path.join(screenshotDir, "06b-reader-mobile-ep1-light.png"),
			});
		}
		await page.close();

		// 6. Tome / Cast View Desktop
		console.log("Capturing 6. Tome / Cast View Desktop...");
		page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
		await page.goto(`${baseUrl}#tomePage`, { waitUntil: "networkidle" });
		await page.waitForTimeout(600);
		await page.screenshot({
			path: path.join(screenshotDir, "07-tome-desktop.png"),
		});
		await page.close();

		console.log("Screenshots captured successfully in", screenshotDir);
	} finally {
		await browser.close();
		if (server) server.kill();
	}
}

capture().catch((err) => {
	console.error("Capture error:", err);
	process.exit(1);
});

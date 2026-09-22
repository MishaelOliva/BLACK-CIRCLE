(() => {
	const reduceMotion = window.matchMedia?.(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const landing = document.getElementById("landingCover");

	document.body.classList.add("design-overhaul");

	if (!landing || reduceMotion || !window.gsap) return;

	// Hyperframes-compatible convention: named, paused timeline with deterministic labels.
	const timeline = window.gsap.timeline({
		paused: true,
		defaults: { ease: "power3.out" },
	});
	timeline
		.set(
			".landing-kicker, .landing-subtitle, .landing-rank-strip, .landing-actions, .landing-dashboard",
			{ opacity: 0 },
		)
		.fromTo(
			".landing-nav",
			{ y: -20, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.8 },
			"intro",
		)
		.fromTo(
			".landing-kicker",
			{ x: -18, opacity: 0 },
			{ x: 0, opacity: 1, duration: 0.55 },
			"intro+=0.16",
		)
		.fromTo(
			".landing-subtitle",
			{ y: 24, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.7 },
			"intro+=0.56",
		)
		.fromTo(
			".landing-rank-strip",
			{ y: 18, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.55 },
			"intro+=0.68",
		)
		.fromTo(
			".landing-actions",
			{ y: 26, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.65 },
			"intro+=0.78",
		)
		.fromTo(
			".landing-dashboard",
			{ y: 38, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.8 },
			"intro+=0.92",
		)
		.fromTo(
			".landing-rings",
			{ scale: 0.78, rotate: -18, opacity: 0 },
			{ scale: 1, rotate: 0, opacity: 0.96, duration: 1.6, ease: "expo.out" },
			"intro",
		);

	window.__timelines = window.__timelines || {};
	window.__timelines.blackCircleLanding = timeline;
	timeline.play(0);

	const pointerX = window.gsap.quickTo(landing, "--bc-pointer-x", {
		duration: 0.75,
		ease: "power3.out",
	});
	const pointerY = window.gsap.quickTo(landing, "--bc-pointer-y", {
		duration: 0.75,
		ease: "power3.out",
	});
	landing.addEventListener("pointermove", (event) => {
		if (window.matchMedia?.("(pointer: coarse)").matches) return;
		const bounds = landing.getBoundingClientRect();
		pointerX(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
		pointerY(((event.clientY - bounds.top) / bounds.height - 0.5) * 14);
	});

	const revealTargets = document.querySelectorAll(
		".reader-hero, .reader-start, .magic-ranks, .reader-tools, .episode-card, .tome-page .cast-card, .tome-page .gallery-card",
	);
	for (const target of revealTargets) target.classList.add("chapter-reveal");
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				window.gsap.to(entry.target, {
					opacity: 1,
					y: 0,
					duration: 0.72,
					ease: "power3.out",
				});
				observer.unobserve(entry.target);
			}
		},
		{ threshold: 0.12 },
	);
	for (const target of revealTargets) observer.observe(target);
})();

# Black Circle: The Quietest Power

Local, offline-first reader and active long-form manuscript for **Black Circle**, an academy-fantasy series about rank, restraint, witness, and the only known Black Circle magician.

## Open the reader

Double-click `Open Black Circle Reader.vbs`, or run:

```powershell
npm run serve
```

Then open `http://127.0.0.1:4174/index.html`.

## Source of truth

- `START HERE.txt`: world primer.
- `episodes/EPISODE 1.txt` through `episodes/EPISODE 32.txt`: active story.
- `episodes/ALL EPISODES.txt`: generated complete-story copy; rebuilt from active sources.
- `STORY-SPINE.md`: long-horizon arc and mystery ownership.
- `CONTINUITY-BIBLE.md`: character and canon state.
- `EPISODE-QUALITY-CHECKLIST.md`: drafting gate.
- `build-site.mjs`: reader generator.
- `index.html`: generated output; do not hand-edit.
- `assets/data/reader-content.js`: generated reader payload.

Story edits belong in the text sources first. Rebuild afterward:

```powershell
npm run build
```

## Episode Media Standards

- **Grand 4K Cover Banner**: Every episode cover must be rendered as a prominent, cinematic full-width banner at the top of the reading section, formatted in 4K crisp quality (`3840x2160` high-DPI key visual).
- **Scene Callouts**: Canonical story scene illustrations must sit in the right-side gutter directly adjacent to their corresponding text narrative on desktop, and collapse cleanly into inline cards on mobile.

## Project commands

```powershell
npm run doctor       # environment preflight
npm run build        # regenerate reader + data payload
npm run serve        # local reader server
npm run audit:story  # prose and structure advisories
npm run check        # JavaScript syntax checks
npm test             # focused local-server test
npm run lint         # Biome lint
npm run ci           # Biome formatting/lint gate
```

## Local security

`serve-reader.mjs` exposes only `index.html` and `assets/**` on loopback. Source manuscripts, MCP files, archives, and repository metadata are not public routes.

The optional MCP bridge also binds to loopback and rejects unapproved browser origins. For bearer authentication, start and probe it from the same shell:

```powershell
$env:MCP_AUTH_TOKEN = "use-a-long-random-local-token"
npm run bridge
npm run probe
```

Additional trusted origins can be supplied explicitly with `MCP_ALLOWED_ORIGINS` as a comma-separated list.

## Release rule

Before shipping reader changes: rebuild, run focused checks, start through the VBS launcher, confirm HTTP `200`, then smoke-test desktop and mobile layouts on localhost.

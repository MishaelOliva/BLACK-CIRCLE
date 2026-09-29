# Black Circle: The Quietest Power

Offline-first web reader and original long-form fantasy manuscript detailing the journey of the only known Black Circle academy mage.

[![CI](https://github.com/MishaelOliva/BLACK-CIRCLE/actions/workflows/ci.yml/badge.svg)](https://github.com/MishaelOliva/BLACK-CIRCLE/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org)
[![License: Dual](https://img.shields.io/badge/License-MIT%20%2F%20All%20Rights%20Reserved-blue.svg)](LICENSE)

## About the Project

*Black Circle: The Quietest Power* is an ongoing original fiction project combined with a custom local reading application. The narrative explores themes of rank, institutional pressure, and restraint through Finn, an unranked student at the Oakhaven arcane academy whose power operates through subtle observation and dampening rather than dramatic force.

This repository contains both the active serialized episode manuscripts and the offline web reader application.

## What it does

- **Offline-first reading**: Serves an episodic web reader with chapter navigation, reading position tracking, and clean typographic controls.
- **Automated compilation**: Builds raw episodic text files into structured browser payloads and single-page reading views.
- **Local server sandbox**: Includes a lightweight Node.js static file server (`serve-reader.mjs`) configured with loopback binding and path-traversal guards.

## Architecture / How it works

The repository separates creative literary sources from reader application components:

```
+-----------------------------------------------------------+
|                   CREATIVE SOURCES                        |
|   episodes/EPISODE 1.txt ... EPISODE 32.txt               |
+-----------------------------+-----------------------------+
                              |
                              | npm run build (build-site.mjs)
                              v
+-----------------------------------------------------------+
|                   COMPILED READER PAYLOAD                 |
|   index.html + assets/data/reader-content.js              |
+-----------------------------+-----------------------------+
                              |
                              | npm run serve (serve-reader.mjs)
                              v
+-----------------------------------------------------------+
|                   LOCAL WEB READER (SPA)                  |
|   Loopback 127.0.0.1:4174 (strict path-traversal guards)  |
+-----------------------------------------------------------+
```

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher)

### Running the Reader Locally

```powershell
git clone https://github.com/MishaelOliva/BLACK-CIRCLE.git
cd BLACK-CIRCLE

# Install dependencies
npm install

# Start local reader server
npm run serve
```

Then open `http://127.0.0.1:4174/index.html` in your web browser.

## Rebuilding the Reader

When episode source texts in `episodes/` are modified, regenerate the reader bundle:

```powershell
npm run build
```

## Testing

The project includes an automated test verifying the loopback server and path-traversal rejection:

```powershell
npm test
```

To run JavaScript syntax checks across build and server scripts:

```powershell
npm run check
```

## Security

`serve-reader.mjs` restricts file serving strictly to loopback (`127.0.0.1`) and only resolves `index.html` and `assets/**`. Requests attempting relative directory traversal (e.g. `../`) are rejected with `403 Forbidden`.

## License

This repository uses a dual license model:

- **Reader software and build tools**: Licensed under the [MIT License](LICENSE).
- **Story manuscript, episodes, world lore, and artwork**: All Rights Reserved &copy; 2026 Mishael Dioneda Oliva.

---
*Written and built by [Mishael Oliva](https://github.com/MishaelOliva) • [LinkedIn](https://linkedin.com/in/mishael-oliva)*

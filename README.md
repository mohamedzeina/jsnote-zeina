# JSNote-Zeina

An interactive JavaScript notebook that runs in your browser. Write, execute, and document JavaScript and React code in a live environment — all from the command line.

---

## Features

- **Live code execution** — code runs instantly in a sandboxed iframe with no setup
- **In-browser bundling** — import any npm package directly; packages are fetched from unpkg.com and cached automatically
- **Monaco editor** — VS Code-quality editor with JSX syntax highlighting and Prettier formatting (`Shift+Enter`)
- **Markdown cells** — write rich documentation alongside your code with a live markdown editor
- **Cumulative execution** — variables and functions defined in earlier cells are available in all later cells
- **`show()` helper** — render any value, object, or React component directly in the preview pane
- **Resizable panels** — drag the divider between the editor and preview to adjust the layout
- **Cell management** — add, delete, and reorder cells using the action bar on each cell
- **Auto-save** — all changes are automatically persisted to the notebook file on disk

---

## Quick Start

```bash
npx jsnote-zeina serve
```

Opens a notebook at `http://localhost:4005`. Creates `notebook.js` in the current directory if it doesn't exist.

---

## Usage

```
npx jsnote-zeina serve [filename] [options]
```

| Option | Description | Default |
|---|---|---|
| `-p, --port <number>` | Port to run the server on | `4005` |

**Examples:**

```bash
# Default — port 4005, file notebook.js
npx jsnote-zeina serve

# Custom port
npx jsnote-zeina serve -p 5000

# Custom file
npx jsnote-zeina serve my-notes.js

# Custom file and port
npx jsnote-zeina serve my-notes.js -p 5000
```

---

## How It Works

### Cell types

**Code cells** — Write JavaScript or JSX. Code is bundled in-browser using esbuild (WASM) and executed inside a sandboxed `<iframe>`.

**Text cells** — Write Markdown. Click a cell to edit, click outside to render the preview.

### The `show()` function

Use `show()` in any code cell to render output in the preview pane:

```js
show(42);
show('hello world');
show([1, 2, 3]);
show({ name: 'Alice', age: 30 });

// Render React components directly
show(<h1>It works!</h1>);
```

### Cumulative execution

Variables and functions defined in earlier cells are automatically available in later cells:

```js
// Cell 1
const greet = (name) => `Hello, ${name}!`;

// Cell 2 — can reference `greet` from Cell 1
show(greet('World'));
```

### Importing npm packages

Any npm package can be imported without installation:

```js
import axios from 'axios';
import _ from 'lodash';
import { useState, useEffect } from 'react';
```

Packages are fetched from `unpkg.com` and cached with `localforage` to avoid redundant network requests.

---

## Tech Stack

| Layer | Technology |
|---|---|
| CLI | Node.js, [Commander](https://github.com/tj/commander.js) |
| Server | [Express](https://expressjs.com/), http-proxy-middleware |
| Frontend | React 18, TypeScript |
| State management | Redux, Redux Thunk, [Immer](https://immerjs.github.io/immer/) |
| Code editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/), Prettier |
| Text editor | [@uiw/react-md-editor](https://github.com/uiwjs/react-md-editor) |
| In-browser bundler | [esbuild](https://esbuild.github.io/) (WASM) |
| Package resolution | [unpkg.com](https://unpkg.com) |
| Styling | [Bulmaswatch](https://jenil.github.io/bulmaswatch/) (Superhero theme), FontAwesome |
| Monorepo | [Lerna](https://lerna.js.org/) |

---

## Architecture

```
CLI (jsnote-zeina)
  └── parses args with Commander
        │
        ▼
Express Server (@jsnote-zeina/local-api)
  ├── GET  /cells  →  reads notebook file from disk
  ├── POST /cells  →  writes notebook file to disk
  ├── Production: serves the static React build
  └── Development: proxies requests to React dev server (:3000)
        │
        ▼
React App (@jsnote-zeina/local-client)
  ├── Redux store manages cells and bundle cache
  ├── Monaco Editor for code input
  ├── esbuild WASM bundles code in-browser
  └── unpkg.com resolves npm imports (with caching)
        │
        ▼
Sandboxed iframe
  └── executes user code in isolation
```

---

## Local Development

### Prerequisites

- Node.js 16+
- npm 7+

### Setup

```bash
git clone https://github.com/mohamedzeina/jbook.git
cd jbook
npm install
npm run start
```

`npm run start` uses Lerna to run all three packages in parallel watch mode:

| Package | What runs |
|---|---|
| `packages/cli` | `tsc --watch` |
| `packages/local-api` | `tsc --watch` |
| `packages/local-client` | React dev server on `:3000` |

Then in a separate terminal, run the CLI against the local build:

```bash
node packages/cli/dist/index.js serve
```

### Project structure

```
jbook/
├── lerna.json
├── package.json
└── packages/
    ├── cli/                         # Published as: jsnote-zeina
    │   └── src/
    │       ├── index.ts             # CLI entry point
    │       └── commands/serve.ts    # `serve` command definition
    │
    ├── local-api/                   # Published as: @jsnote-zeina/local-api
    │   └── src/
    │       ├── index.ts             # Express server setup
    │       └── routes/cells.ts      # GET /cells, POST /cells
    │
    └── local-client/                # Published as: @jsnote-zeina/local-client
        └── src/
            ├── components/          # React UI components
            ├── state/               # Redux store, reducers, action creators
            ├── hooks/               # Custom React hooks
            └── bundler/             # esbuild WASM + unpkg plugins
```

### Publishing

Each package is versioned and published independently to npm via Lerna:

```bash
npx lerna publish
```

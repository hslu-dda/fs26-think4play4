# Easing Sketch — Setup Guide

## What this sketch does

A rectangle sits in the centre of the screen. You can change its **size**, **rotation**, and **colour** — and instead of jumping instantly to the new value, it _eases_ there smoothly using Robert Penner's easing functions.

You control everything from two places at once:

- **The sketch itself** — via a lil-gui panel in the top-right corner
- **A controller page** — a separate page you can open on your phone, tablet, or a second browser window

The two stay in sync over a small local server using **Socket.io**.

---

## What is Socket.io?

Socket.io lets two browser pages talk to each other in real time over a local server. Think of the server as a radio tower — the controller page broadcasts a signal ("diameter changed to 400"), and the sketch receives it instantly.

You don't need to understand how it works inside. Just follow the steps below and it will work.

---

## Two versions of the controller

There are two controller pages that do exactly the same thing — they just look different. Use whichever makes more sense to you or is easier to design according to your needs

### `lilGui.html` — lil-gui version

Uses [lil-gui](https://lil-gui.georgealways.com/), a ready-made library that turns a plain JavaScript object into a control panel automatically. You define your parameters as an object, call `gui.add(...)`, and the UI appears. It's the fastest way to build a GUI in a sketch.

```js
const params = { diameter: 200 };
gui.add(params, "diameter", 0, 800).onChange((v) => socket.emit("diameter", v));
// ↑ one line: creates the slider, sets the range, sends the value
```

Good for: quickly adding controls while sketching. The GUI builds itself.

### `gui.html` — plain HTML version

Uses standard HTML elements (`<input type="range">`, `<select>`, `<input type="color">`) with a handwritten CSS file (`gui-native.css`) for styling. Each control is wired up manually with an event listener.

```html
<input type="range" id="diameter" min="0" max="800" value="200" />

<script>
  document.getElementById("diameter").addEventListener("input", function () {
    document.getElementById("diameter-val").textContent = this.value;
    socket.emit("diameter", Number(this.value));
  });
</script>
```

It's more code per control, but you can see exactly what's happening — there's no library magic. The styling lives in `gui-native.css` and you can change every pixel of it.

Good for: full visual control.

---

## Folder structure

Make sure your project looks like this:

```
your-sketch/
├── index.html
├── sketch.js
├── lilGui.html            ← lil-gui version
├── gui.html     ← plain HTML version
├── gui-native.css      ← styles for the plain HTML version
├── server.js
├── package.json          ← holds npm information
├── node_modules/         ← created by npm
└── libraries/
    ├── p5.min.js
    ├── p5.easing.js
    ├── lil-gui.min.js
    └── stats.min.js
```

---

## One-time setup

You only need to do this once per project.

**1. Install Node.js** if you don't have it yet. Pick one method:

- **Direct download** (simplest) → [nodejs.org](https://nodejs.org), download the LTS version
- **Homebrew** (Mac) — if you already have [brew](https://brew.sh) installed:
  ```bash
  brew install node
  ```

**2. Open a terminal** in your project folder.
On Mac: right-click the folder in Finder → "New Terminal at Folder"
On Windows: shift-right-click → "Open PowerShell window here"

**3. Install the server dependencies:**

```bash
npm install socket.io
```

This creates a `node_modules` folder — that's normal, don't touch it.

---

## Running the sketch

Every time you want to work on the sketch, do these steps in order:

**Step 1 — Start the relay server** in your terminal:

```bash
node server.js
```

You should see:

```
✅ Socket.io relay running on port 8080
```

Leave this terminal open while you work. To stop it, press `Ctrl + C`.

**Step 2 — Open the sketch** in your browser:

```
http://localhost:5500
```

(Use the Live Server extension in VS Code, or any local server you prefer.)

**Step 3 — Open the controller** in a second browser tab or on your phone:

```
http://localhost:5500/gui.html
```

or

```
http://localhost:5500/gui-native.html
```

The status dot turns green when the connection is working.

---

## Controls

| Control         | What it does                                   |
| --------------- | ---------------------------------------------- |
| Easing function | Changes the shape of the animation curve       |
| Duration        | How long the animation takes (in milliseconds) |
| Color           | Fill colour of the rectangle                   |
| Rotation        | Target rotation angle — animates smoothly      |
| Diameter        | Target size — animates smoothly                |

**Keyboard shortcuts** (click the sketch first so it has focus):

| Key | Action                                   |
| --- | ---------------------------------------- |
| `n` | Jump to a random new size and rotation   |
| `g` | Show / hide the GUI panel                |
| `s` | Save current settings to `settings.json` |
| `l` | Load settings from `settings.json`       |

---

## Using it on your phone or iPad

**This is probably working at home but not on the hslu wifi. Neets Testing! Else we switch to render.com**

1. Make sure your phone is on the **same Wi-Fi network** as your laptop.
2. Find your laptop's local IP address:
   - Mac: `ipconfig getifaddr en0` in the terminal
   - Windows: `ipconfig` → look for "IPv4 Address"
3. Open `http://YOUR_IP:5500/gui.html` (or `gui-native.html`) on your phone's browser.

The controller should automatically detects whether it's running locally or on a phone and connects to the right server — you don't need to change any URLs. **Thats untestet though. But Claude is confident**

---

## Troubleshooting

**Status dot stays red**
→ The server is probably not running. Go to your terminal and run `node server.js`.

**`node` command not found**
→ Node.js is not installed. Download it from [nodejs.org](https://nodejs.org).

**Changes in the controller don't show in the sketch**
→ Check that both pages show a green status dot. If the sketch doesn't have one, reload it.

**Port 8080 already in use**
→ Another program is using that port. Open `server.js` and change `8080` to `8081`, then do the same in `sketch.js`, `gui.html`, and `gui-native.html`.

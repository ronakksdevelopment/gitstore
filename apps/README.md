# apps/

Every listing on gitstore is one JSON file in this folder. To submit an app, add a new file here named `<your-app-id>.json` and open a pull request.

## File naming

The filename (without `.json`) must exactly match the `id` field inside it. Use lowercase letters, numbers, and hyphens only — e.g. `pixel-notes.json`, not `PixelNotes.json` or `pixel_notes.json`.

This also doubles as duplicate protection: if your chosen id is already taken, your PR will conflict with the existing file and you'll know to pick a different one.

## Schema

```json
{
  "id": "example-app",
  "name": "Example App",
  "author": "your-github-username",
  "desc": "One short sentence describing what it does. Under 100 characters.",
  "longDesc": "A longer description shown on the detail page. A few sentences about what the app does, who it's for, and anything notable about how it works.",
  "url": "https://your-username.github.io/your-repo/",
  "category": "productivity",
  "color": "#58A6FF",
  "icon": "https://your-username.github.io/your-repo/icon.png",
  "added": "2026-07-28",
  "schemaVersion": 1
}
```

## Field reference

| Field | Required | Description |
|---|---|---|
| `id` | yes | Slug, must match the filename. Lowercase, hyphens only. |
| `name` | yes | Display name, any casing. |
| `author` | yes | Your GitHub username. |
| `desc` | yes | Short one-line description, under ~100 characters. Shown on the card grid. |
| `longDesc` | yes | A few sentences shown on the detail view. |
| `url` | yes | The live URL of your PWA. Must be `https://`. This is what "Install" and "Open in browser" link to. |
| `category` | yes | One of: `developer-tools`, `productivity`, `music`, `utilities`, `creative`. Open an issue if you think a new category is needed. |
| `color` | yes | A hex color (e.g. `#58A6FF`) used as the background of your app's icon tile. |
| `icon` | no | Optional `https://` URL to a square icon image (e.g. your PWA's own icon.png). Shown as the app's tile instead of the colored initial. Leave blank (`""`) to use the colored initial tile — if the URL is missing, unreachable, or fails to load, the site falls back to that automatically. |
| `added` | yes | ISO date (`YYYY-MM-DD`) of submission. |
| `schemaVersion` | yes | Always `1` for now. Lets the schema evolve later without breaking existing listings. |

## Icons

gitstore doesn't host image files, and never will — every listing stays pure text in one JSON file, which keeps pull requests small, easy to review line-by-line, and free of binary-file risk.

You can still show a real icon by linking to one: set `icon` to an `https://` URL pointing at an image you already host (typically your own PWA's `icon.png`, at its own domain). gitstore only stores that link, never the image itself. If you leave `icon` blank, or the link ever breaks, the app automatically falls back to a colored initial tile generated from its `name` and `color` — so this field is always safe to omit.

## Submitting

1. Submit directly through the site's "Submit app" button (opens a pull request for you automatically), or fork this repo and add the file yourself.
2. Add your file under `apps/`, following the schema above.
3. Open a pull request (the site does this step for you if you used "Submit app").
4. An automated check validates the JSON's shape immediately; a maintainer then reviews it — checking the URL is a real, working PWA, the content follows the disclaimer/guidelines, and everything else looks right — then merges.

See the root [README.md](../README.md) for the full project overview and contribution guidelines.

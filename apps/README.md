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
  "icon": "",
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
| `icon` | no | Reserved for future use. Leave as an empty string for now — see note below. |
| `added` | yes | ISO date (`YYYY-MM-DD`) of submission. |
| `schemaVersion` | yes | Always `1` for now. Lets the schema evolve later without breaking existing listings. |

## Why no icon images?

gitstore doesn't host image files. Every listing is pure text in one JSON file, which keeps pull requests small, easy to review line-by-line, and free of binary-file risk. Instead, each app gets a colored initial tile generated from its `name` and `color`. This may change in the future to support linking an icon hosted at your own app's domain.

## Submitting

1. Fork this repo (or, once GitHub auth is wired into the site, submit directly through the "Submit app" button).
2. Add your file under `apps/`.
3. Open a pull request.
4. A maintainer reviews it — checking the URL is a real, working PWA, the content follows the [disclaimer/guidelines], and the JSON is well-formed — then merges.

See the root [README.md](../README.md) for the full project overview and contribution guidelines.

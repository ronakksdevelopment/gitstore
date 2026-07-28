# gitstore

A GitHub-native app store for PWAs — built as a single static page with zero servers, zero databases, and zero hosting bills.

**Live:** https://ronakksdevelopment.github.io/gitstore/

## What this is

gitstore is a directory of installable PWAs (Progressive Web Apps), styled to look and feel like an app store. Everything about it lives inside this one GitHub repo:

- Every listing is a single JSON file in [`apps/`](./apps/)
- The website is one static `index.html` — no build step, no framework, no backend
- Reading the store means fetching files from this repo via the public GitHub API
- Submitting an app means opening a pull request that adds a new file to `apps/`
- Reviewing a submission means reviewing that pull request, same as any other change to this repo

If you can use GitHub, you already know how to use gitstore.

## How to submit your app

You have two options — pick whichever you're more comfortable with.

### Option A — through the website (recommended)

1. Go to the [live site](https://ronakksdevelopment.github.io/gitstore/)
2. Click **Sign in**, and follow the on-screen steps to create a free, scoped [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) (2 minutes, GitHub's own UI — the site walks you through exactly which permissions to grant)
3. Click **+ Submit app**, read and agree to the disclaimer, then fill in your app's name, description, category, and URL
4. Click **Open pull request** — this creates a branch, commits your listing, and opens a PR automatically
5. A maintainer reviews and merges it; once merged, it appears live on the site

Your token is stored only in your own browser's `localStorage`. It's never sent anywhere except directly to GitHub's own API — there is no gitstore server in the middle.

### Option B — manually, no token needed

If you'd rather not create a token at all:

1. Fork this repo
2. Add a new file at `apps/<your-app-slug>.json` following the schema in [`apps/README.md`](./apps/README.md)
3. Open a pull request back to this repo

Either way, the same automated check runs on your PR (see below), and the same human review happens before it's merged.

## What happens after you submit

- A [GitHub Action](./.github/workflows/validate-apps.yml) automatically checks your PR within seconds — validating your JSON, checking required fields, confirming the slug/filename match, and making sure your PR doesn't touch anything outside `apps/`
- It posts the result as a comment directly on your PR — a green check if everything's valid, or a specific, fixable list if something's wrong
- Once it's structurally valid, a maintainer reviews the actual content (is this a real, working app? does it belong here?) and merges it
- The live site re-fetches merged listings from `main` — no deploy step needed beyond the merge itself

## Project structure

```
gitstore/
├── index.html                      the entire website
├── gitstore_logo.png               site logo (swap this file to update the logo everywhere)
├── apps/
│   ├── README.md                   the listing schema, explained
│   └── <slug>.json                 one file per submitted app
└── .github/
    ├── workflows/validate-apps.yml runs on every PR touching apps/
    └── scripts/validate-apps.js    the validation logic itself
```

## Why it's built this way

No servers means no bills, no uptime to maintain, and no account system beyond GitHub's own. The tradeoff is that "login" here means pasting a scoped personal access token rather than a real OAuth flow — a true `Login with GitHub` button needs a client secret that can't safely live in pure frontend code. A token scoped to just this repo, stored only on your device, is the closest equivalent that stays 100% static.

This also means gitstore doesn't host or vet any app's actual content — it only stores a link to it. See the **disclaimer** (linked in the site footer) for exactly what that means.

## Run your own copy

gitstore is MIT licensed. Fork it, rename it, point `GH_OWNER` / `GH_REPO` in `index.html` at your own repo, and you have your own independent app store with your own moderation rules.

## Contributing to gitstore itself

Improvements to the site, the validation Action, or the docs are welcome as pull requests. For bugs or ideas, open an issue.

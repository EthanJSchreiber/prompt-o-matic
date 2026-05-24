# The Prompt-O-Matic 3000

A deliberately ugly, deliberately fast writing-prompt machine. 100 hand-curated
prompts across five genres, served one at a time, with no repeats until you've
seen them all.

## Genres

- Non-fiction
- Literary fiction
- Fantasy
- Science fiction
- Poetry

20 prompts per genre to start. Optional "tone suggestion" checkbox layers a
random tone (snarky, melancholic, deadpan, etc.) on top of the prompt.

## Editing prompts

All prompts live in [`prompts.yml`](prompts.yml). To add one, append:

```yaml
- genre: fantasy
  text: Your new prompt here.
```

`genre` must be one of: `non-fiction`, `literary-fiction`, `fantasy`, `sci-fi`,
`poetry`. To add a *new* genre, also add a `<label>` to the radio group in
[`index.html`](index.html).

Tones are also editable in `prompts.yml` under the `tones:` key.

## Running locally

Because the page loads `prompts.yml` via `fetch()`, you cannot just
double-click `index.html` — browsers block `file://` fetches. Start a tiny
local server:

```sh
# Python 3
python -m http.server 8000

# or Node
npx http-server -p 8000
```

Then open <http://localhost:8000>.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, go to **Pages**.
3. Set source to `main` branch, `/` (root).
4. Wait a minute. Your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.

No build step. No framework. No CSS file. The HTML uses elements like
`<font>`, `<center>`, and `<blockquote>` on purpose — it is supposed to look
like it was made in 1998.

## How "no repeats" works

Each genre maintains its own list of seen prompt IDs in `localStorage`
(`promptomatic.seen.<genre>`). When you exhaust a genre, the page offers a
"start over" link that clears that genre's cache. The footer also has a
generic `[start over]` link that clears the *currently selected* genre.

Clearing browser data or opening in incognito will also reset the cache.

// The Prompt-O-Matic 3000
// -----------------------
// Loads prompts.yml, lets the user request a random prompt by genre,
// and tracks which prompts have been served via localStorage so the
// same prompt is not shown twice in a single genre.

const STORAGE_PREFIX = 'promptomatic.seen.';
let PROMPTS = [];
let TONES = [];

// Display names override the raw genre keys anywhere user-facing.
// The data structure (prompts.yml, localStorage keys) is unchanged.
const GENRE_DISPLAY = {
  'non-fiction': 'personal non-fiction',
};
function displayGenre(g) {
  return GENRE_DISPLAY[g] || g;
}

// --- loading ---------------------------------------------------------------

async function loadData() {
  const res = await fetch('prompts.yml', { cache: 'no-cache' });
  if (!res.ok) throw new Error('failed to load prompts.yml: ' + res.status);
  const yamlText = await res.text();
  const data = jsyaml.load(yamlText);
  PROMPTS = (data.prompts || []).map((p, i) => ({ ...p, id: i }));
  TONES = data.tones || [];
}

// --- cache (localStorage) --------------------------------------------------

function getSeen(genre) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + genre);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

function markSeen(genre, id) {
  const seen = getSeen(genre);
  seen.add(id);
  localStorage.setItem(STORAGE_PREFIX + genre, JSON.stringify([...seen]));
}

function resetSeen(genre) {
  localStorage.removeItem(STORAGE_PREFIX + genre);
}

function resetAll() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(STORAGE_PREFIX))
    .forEach(k => localStorage.removeItem(k));
}

// --- helpers ---------------------------------------------------------------

function selectedGenre() {
  const checked = document.querySelector('input[name="genre"]:checked');
  return checked ? checked.value : null;
}

function promptsFor(genre) {
  return PROMPTS.filter(p => p.genre === genre);
}

function unseenFor(genre) {
  const seen = getSeen(genre);
  return promptsFor(genre).filter(p => !seen.has(p.id));
}

// Cryptographically strong uniform random integer in [0, n).
// Uses rejection sampling so there is zero modulo bias. Each browser
// session gets independent randomness from the OS, so two users on
// the same site will see prompts in different orders.
function randInt(n) {
  if (n <= 0) return 0;
  const max = Math.floor(0xFFFFFFFF / n) * n;
  const buf = new Uint32Array(1);
  let x;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= max);
  return x % n;
}

function pick(arr) {
  return arr[randInt(arr.length)];
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// --- render ----------------------------------------------------------------

function renderPrompt(prompt, tone) {
  const out = document.getElementById('output-area');
  const toneLine = tone
    ? `<br><br><font face="Times New Roman" size="3"><b>Tone:</b> <i>${escapeHtml(tone)}</i></font>`
    : '';
  out.innerHTML = `
    <blockquote>
      <font face="Times New Roman" size="5">&ldquo;${escapeHtml(prompt.text)}&rdquo;</font>
      <br><br>
      <font face="Times New Roman" size="2" color="#666666">
        genre: <i>${escapeHtml(displayGenre(prompt.genre))}</i>
      </font>
      ${toneLine}
    </blockquote>
  `;
}

function renderExhausted(genre) {
  const out = document.getElementById('output-area');
  const label = displayGenre(genre);
  out.innerHTML = `
    <blockquote>
      <font face="Times New Roman" size="4">
        <b>You have seen every <i>${escapeHtml(label)}</i> prompt we have.</b>
      </font>
      <br><br>
      <font face="Times New Roman" size="3">
        Hit <a href="#" id="reset-genre-link">[start over for ${escapeHtml(label)}]</a>
        to clear the cache for this genre, or
        <a href="#" id="reset-all-link">[start over for everything]</a>.
      </font>
    </blockquote>
  `;
  document.getElementById('reset-genre-link').addEventListener('click', e => {
    e.preventDefault();
    resetSeen(genre);
    updateCounter();
    document.getElementById('output-area').innerHTML =
      '<font face="Times New Roman" size="3" color="#555555"><i>Cache cleared. Hit PROMPT ME for a fresh one.</i></font>';
  });
  document.getElementById('reset-all-link').addEventListener('click', e => {
    e.preventDefault();
    resetAll();
    updateCounter();
    document.getElementById('output-area').innerHTML =
      '<font face="Times New Roman" size="3" color="#555555"><i>All caches cleared.</i></font>';
  });
}

function renderError(msg) {
  document.getElementById('output-area').innerHTML =
    `<font face="Times New Roman" size="3" color="#aa0000"><b>Error:</b> ${escapeHtml(msg)}</font>`;
}

function updateCounter() {
  const counter = document.getElementById('counter');
  const genre = selectedGenre();
  if (!genre) { counter.textContent = ''; return; }
  const total = promptsFor(genre).length;
  const left = unseenFor(genre).length;
  counter.textContent = `${left} of ${total} unseen in "${displayGenre(genre)}"`;
}

// --- handlers --------------------------------------------------------------

function onPromptClick() {
  const genre = selectedGenre();
  if (!genre) { renderError('pick a genre first.'); return; }

  const pool = unseenFor(genre);
  if (pool.length === 0) {
    renderExhausted(genre);
    return;
  }

  const prompt = pick(pool);
  markSeen(genre, prompt.id);

  const wantTone = document.getElementById('tone-toggle').checked;
  const tone = wantTone && TONES.length ? pick(TONES) : null;

  renderPrompt(prompt, tone);
  updateCounter();
}

function onResetClick(e) {
  e.preventDefault();
  const genre = selectedGenre();
  if (!genre) { resetAll(); }
  else { resetSeen(genre); }
  updateCounter();
  document.getElementById('output-area').innerHTML =
    '<font face="Times New Roman" size="3" color="#555555"><i>Cache cleared. Hit PROMPT ME for a fresh one.</i></font>';
}

// --- boot ------------------------------------------------------------------

(async function init() {
  try {
    await loadData();
  } catch (e) {
    renderError(e.message + ' — if you are opening this file directly (file://), run a local server instead. See README.md.');
    document.getElementById('counter').textContent = 'unavailable';
    return;
  }

  document.getElementById('prompt-btn').addEventListener('click', onPromptClick);
  document.getElementById('reset-link').addEventListener('click', onResetClick);
  document.querySelectorAll('input[name="genre"]').forEach(r => {
    r.addEventListener('change', updateCounter);
  });

  updateCounter();
})();

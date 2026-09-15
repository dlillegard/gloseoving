(() => {
'use strict';

const { parseWords, createRound, submitAnswer, normalize } = globalThis.GloseovingCore;
const { loadList, saveList } = globalThis.GloseovingStorage;

const $ = id => document.getElementById(id);
const list = $('word-list');
let parsed = { words: [], errors: [] };
let round = null;
const sample = 'die Katze - katten\ndas Haus - huset\nlernen - å lære\nder Freund - vennen\ndie Schule - skolen\nspielen - å leke';

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function renderWords(container, words, result = null) {
  const fragment = document.createDocumentFragment();
  const header = element('div', undefined, 'table-head');
  header.setAttribute('aria-hidden', 'true');
  header.append(element('span', '#'), element('span', 'TYSK'), element('span', 'NORSK'));
  fragment.append(header);
  const rows = element('ol');
  rows.style.cssText = 'list-style:none;margin:0;padding:0';
  words.forEach((word, index) => {
    const correct = result && index < result.index;
    const wrong = result?.phase === 'failed' && index === result.index;
    const row = element('li', undefined, `word-row${correct ? ' correct' : wrong ? ' wrong' : ''}`);
    const status = element('span', result ? correct ? '✓' : wrong ? '✕' : '—' : String(index + 1));
    if (result) status.setAttribute('aria-label', correct ? 'Riktig' : wrong ? 'Feil' : 'Ikke besvart');
    const german = element('span', word.german);
    german.lang = 'de';
    row.append(status, german, element('span', word.norwegian));
    rows.append(row);
  });
  fragment.append(rows);
  container.replaceChildren(fragment);
}

function goToLine(lineNumber) {
  const lines = list.value.split('\n');
  const start = lines.slice(0, lineNumber - 1).reduce((sum, line) => sum + line.length + 1, 0);
  list.focus();
  list.setSelectionRange(start, start + lines[lineNumber - 1].length);
}

function updateImport() {
  parsed = parseWords(list.value);
  const count = parsed.words.length;
  $('import-status').textContent = parsed.errors.length
    ? `${parsed.errors.length} ${parsed.errors.length === 1 ? 'linje må' : 'linjer må'} rettes før du starter`
    : count ? `${count} ${count === 1 ? 'glose klar' : 'gloser klare'} til øving` : 'Venter på glosene dine';
  list.setAttribute('aria-invalid', String(parsed.errors.length > 0));
  $('import-errors').hidden = !parsed.errors.length;
  $('error-list').replaceChildren(...parsed.errors.map(error => {
    const item = element('li');
    const button = element('button', `Linje ${error.line}: ${error.message}`);
    button.type = 'button';
    button.addEventListener('click', () => goToLine(error.line));
    item.append(button);
    return item;
  }));
  $('preview').hidden = !count;
  $('preview-count').textContent = `(${count})`;
  renderWords($('preview-list'), parsed.words);
  $('start-button').replaceChildren(document.createTextNode(count && !parsed.errors.length ? `Start øving med ${count} ${count === 1 ? 'glose' : 'gloser'}` : 'Start øving'), element('span', '→'));
  $('example-button').hidden = Boolean(list.value.trim());
}

function persist() {
  $('storage-note').textContent = saveList(list.value) ? 'Lista huskes i denne nettleseren.' : 'Nettleseren kunne ikke lagre lista. Du kan fortsatt øve.';
}

function showView(view) {
  for (const name of ['editor', 'practice', 'result']) $(name + '-view').hidden = name !== view;
  const step = view === 'editor' ? 'editor' : round?.phase === 'complete' ? 'complete' : 'practice';
  for (const name of ['editor', 'practice', 'complete']) {
    $('step-' + name).removeAttribute('aria-current');
  }
  $('step-' + step).setAttribute('aria-current', 'step');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function showQuestion(feedback = '') {
  showView('practice');
  $('attempt-label').textContent = `Forsøk ${round.attempt} · ${round.randomOrder ? 'Tilfeldig rekkefølge' : 'Listas rekkefølge'}`;
  $('progress-label').textContent = `Ord ${round.index + 1} av ${round.words.length}`;
  $('correct-count').textContent = `${round.index} riktig på rad`;
  $('progress').max = round.words.length;
  $('progress').value = round.index;
  $('practice-title').textContent = round.words[round.index].norwegian;
  $('answer').value = '';
  $('answer').setAttribute('aria-invalid', 'false');
  $('answer').setAttribute('aria-label', `Svaret ditt: det tyske ordet for ${round.words[round.index].norwegian}`);
  $('answer-error').textContent = '';
  $('correct-feedback').textContent = feedback;
  $('answer').focus({ preventScroll: true });
}

function showResult() {
  const completed = round.phase === 'complete';
  showView('result');
  $('result-banner').classList.toggle('success', completed);
  $('result-symbol').textContent = completed ? '✓' : '✕';
  $('result-eyebrow').textContent = completed ? 'UTFORDRINGEN KLART' : `FORSØK ${round.attempt} · EN FEIL I SVARET`;
  $('result-title').textContent = completed ? 'Alle glosene riktig på rad!' : 'Se over. Prøv på nytt.';
  $('result-description').textContent = completed
    ? `Du klarte ${round.words.length} av ${round.words.length} gloser uten feil. Godt jobbet!`
    : `Du klarte ${round.index} av ${round.words.length} før feilen. Studer lista, og start på nytt fra første ord når du er klar.`;
  $('answer-comparison').hidden = completed;
  if (!completed) {
    $('submitted-answer').textContent = round.answer;
    $('expected-answer').textContent = round.words[round.index].german;
    $('answer-explanation').textContent = {
      article: 'Husk riktig artikkel foran substantivet: der, die eller das.',
      capitalization: 'Store og små bokstaver må være som i fasiten. Husk stor forbokstav i tyske substantiv.',
      spelling: 'Sammenlign svaret ditt med fasiten. Sjekk stavemåten og eventuelle tegn.'
    }[round.reason];
  }
  $('retry-button').replaceChildren(document.createTextNode(completed ? 'Øv på hele lista igjen' : 'Start på nytt'), element('span', '↻'));
  $('overview-count').textContent = `${round.words.length} ${round.words.length === 1 ? 'glose' : 'gloser'}`;
  renderWords($('result-list'), round.words, round);
  $('result-title').focus({ preventScroll: true });
}

$('random-order').addEventListener('change', () => {
  $('order-help').textContent = $('random-order').checked
    ? 'Glosene stokkes før hvert forsøk.'
    : 'Glosene kommer i samme rekkefølge som i lista.';
});
list.value = loadList();
updateImport();
list.addEventListener('input', () => { updateImport(); persist(); });
$('example-button').addEventListener('click', () => {
  list.value = sample;
  updateImport();
  persist();
  list.focus();
});
$('editor-form').addEventListener('submit', event => {
  event.preventDefault();
  updateImport();
  if (parsed.errors.length) { $('error-heading').focus(); return; }
  if (!parsed.words.length) {
    $('import-status').textContent = 'Lim inn minst én glose før du starter.';
    list.setAttribute('aria-invalid', 'true');
    list.focus();
    return;
  }
  persist();
  round = createRound(parsed.words, 1, $('random-order').checked);
  showQuestion();
});
$('answer-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!round || round.phase !== 'practice') return;
  if (!normalize($('answer').value)) {
    $('answer-error').textContent = 'Skriv et svar før du sjekker.';
    $('answer').setAttribute('aria-invalid', 'true');
    $('answer').focus();
    return;
  }
  round = submitAnswer(round, $('answer').value);
  if (round.phase === 'practice') showQuestion(`✓ Riktig! ${round.index} på rad.`);
  else showResult();
});
$('retry-button').addEventListener('click', () => {
  if (!round || round.phase === 'practice') return;
  round = createRound(round.sourceWords, round.attempt + 1, round.randomOrder);
  showQuestion();
});
document.querySelectorAll('.edit-button').forEach(button => button.addEventListener('click', () => {
  round = null;
  showView('editor');
  $('editor-title').focus({ preventScroll: true });
}));

$('start-button').disabled = false;
$('boot-status').hidden = true;
})();

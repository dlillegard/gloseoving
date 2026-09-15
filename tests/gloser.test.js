import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import '../gloser.js';
const { parseWords, checkAnswer, createRound, submitAnswer } = globalThis.GloseovingCore;

test('nettleserskriptene kan leses som vanlige skript uten modullaster', () => {
  for (const name of ['gloser.js', 'lagring.js', 'app.js']) {
    const source = readFileSync(new URL('../' + name, import.meta.url), 'utf8');
    assert.doesNotThrow(() => new Script(source, { filename: name }));
  }
});

test('Classroom-tekst: rekkefølge, CRLF, tomme linjer og tankestrek', () => {
  assert.deepEqual(parseWords('die Katze - katten\r\n\r\ndas Haus – huset').words, [
    { german: 'die Katze', norwegian: 'katten' }, { german: 'das Haus', norwegian: 'huset' }
  ]);
});
test('bevarer bindestrek inni ord og komma i oversettelser', () => {
  assert.deepEqual(parseWords('das E-Mail-Postfach - e-postkassen\nspielen - å leke, å spille').words, [
    { german: 'das E-Mail-Postfach', norwegian: 'e-postkassen' },
    { german: 'spielen', norwegian: 'å leke, å spille' }
  ]);
});
test('rapporterer ugyldige, tomme og tvetydige linjer med linjenummer', () => {
  const result = parseWords('lernen - å lære\nfeil linje\n - katten\ndie Katze - \na - b - c');
  assert.equal(result.words.length, 1);
  assert.deepEqual(result.errors.map(error => error.line), [2, 3, 4, 5]);
});
test('substantiv krever riktig artikkel og stor bokstav', () => {
  assert.equal(checkAnswer('Die Katze', 'die Katze').reason, 'capitalization');
  assert.equal(checkAnswer('der Katze', 'die Katze').reason, 'article');
  assert.equal(checkAnswer('Katze', 'die Katze').reason, 'article');
  assert.equal(checkAnswer('die katze', 'die Katze').reason, 'capitalization');
  assert.equal(checkAnswer('die Katzen', 'die Katze').correct, false);
});
test('samme substantivregler gjelder sammensatte uttrykk', () => {
  assert.equal(checkAnswer('das Rote Kreuz', 'das Rote Kreuz').correct, true);
  assert.equal(checkAnswer('das rote Kreuz', 'das Rote Kreuz').correct, false);
});
test('alle ord skiller mellom store og små bokstaver og spesialtegn', () => {
  assert.equal(checkAnswer('LERNEN', 'lernen').correct, false);
  assert.equal(checkAnswer('schon', 'schön').correct, false);
});
test('normaliserer mellomrom, nonbreaking space og Unicode', () => {
  assert.equal(checkAnswer('  die\u00a0  Katze ', 'die Katze').correct, true);
  assert.equal(checkAnswer('scho\u0308n', 'schön').correct, true);
});
const words = [{ german: 'die Katze', norwegian: 'katten' }, { german: 'lernen', norwegian: 'å lære' }];
test('feil stopper runden og bevarer hele lista', () => {
  let round = submitAnswer(createRound(words), 'die Katze');
  round = submitAnswer(round, 'feil');
  assert.equal(round.phase, 'failed');
  assert.equal(round.index, 1);
  assert.deepEqual(round.words, words);
  assert.equal(submitAnswer(round, 'lernen'), round);
  const retry = createRound(round.words, round.attempt + 1);
  assert.equal(retry.index, 0);
  assert.equal(retry.attempt, 2);
  assert.deepEqual(retry.words, words);
});
test('tomt svar forbruker ikke en glose eller et forsøk', () => {
  const round = createRound(words);
  assert.equal(submitAnswer(round, '  '), round);
});
test('fullføring kan ikke sende inn flere svar eller gå ut av lista', () => {
  let round = createRound(words);
  round = submitAnswer(submitAnswer(round, 'die Katze'), 'lernen');
  assert.equal(round.phase, 'complete');
  assert.equal(round.index, 2);
  assert.equal(submitAnswer(round, 'lernen'), round);
});
test('én glose fungerer og tomme runder avvises', () => {
  assert.equal(submitAnswer(createRound([words[0]]), 'die Katze').phase, 'complete');
  assert.throws(() => createRound([]));
});

test('substantiv uten artikkel og uttrykk er også case sensitive', () => {
  assert.equal(checkAnswer('angst haben', 'Angst haben').reason, 'capitalization');
  assert.equal(checkAnswer('Angst haben', 'Angst haben').correct, true);
  assert.equal(checkAnswer('Katze', 'Katze').correct, true);
  assert.equal(checkAnswer('katze', 'Katze').correct, false);
});
test('tilfeldige runder bevarer alle gloser og originalen, også ved omstart', () => {
  const original = [...words, { german: 'das Haus', norwegian: 'huset' }];
  const round = createRound(original, 1, true, () => 0);
  assert.deepEqual(round.words, [original[1], original[2], original[0]]);
  assert.deepEqual(round.sourceWords, original);
  assert.notEqual(round.words, original);
  const failed = submitAnswer(round, 'feil');
  assert.equal(failed.phase, 'failed');
  const retry = createRound(failed.sourceWords, 2, failed.randomOrder, () => 0.99);
  assert.deepEqual(retry.words, original);
  assert.equal(retry.index, 0);
  assert.equal(retry.attempt, 2);
  assert.equal(createRound([words[0]], 1, true).words.length, 1);
});

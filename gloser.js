(() => {
'use strict';

/** Spaces and Unicode composition from pasted Classroom text are insignificant. */
function normalize(value) {
  return value.normalize('NFC').trim().replace(/\s+/gu, ' ');
}

function parseWords(text) {
  const words = [];
  const errors = [];
  text.split(/\r\n|\n|\r/u).forEach((raw, index) => {
    if (!raw.trim()) return;
    const line = raw.trim();
    // Split only on a spaced separator: commas and word-internal hyphens survive.
    const separators = [...line.matchAll(/\s+[-–—]\s+/gu)];
    if (separators.length !== 1) {
      errors.push({ line: index + 1, message: 'Bruk ett skille med mellomrom: tysk ord - norsk ord.' });
      return;
    }
    const split = separators[0];
    const german = normalize(line.slice(0, split.index));
    const norwegian = normalize(line.slice(split.index + split[0].length));
    if (!german || !norwegian) {
      errors.push({ line: index + 1, message: 'Både det tyske og det norske ordet må være med.' });
      return;
    }
    words.push({ german, norwegian });
  });
  return { words, errors };
}

function checkAnswer(answer, expected) {
  const given = normalize(answer);
  const correct = normalize(expected);
  if (!given) return { correct: false, reason: 'empty' };
  if (given === correct) return { correct: true };
  if (given.toLocaleLowerCase('de') === correct.toLocaleLowerCase('de')) {
    return { correct: false, reason: 'capitalization' };
  }
  const noun = /^(der|die|das)\s+(.+)$/iu.exec(correct);
  const parts = /^(\S+)\s+(.+)$/u.exec(given);
  if (noun && (!parts || parts[1].toLocaleLowerCase('de') !== noun[1].toLocaleLowerCase('de'))) {
    return { correct: false, reason: 'article' };
  }
  return { correct: false, reason: 'spelling' };
}

/** A stopped or completed round cannot accept another answer. */
function createRound(words, attempt = 1, randomOrder = false, random = Math.random) {
  if (!words.length) throw new Error('En runde trenger minst én glose.');
  const sourceWords = [...words];
  const orderedWords = [...words];
  if (randomOrder) {
    // Fisher–Yates: shuffle a copy so the pasted list is never changed.
    for (let i = orderedWords.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [orderedWords[i], orderedWords[j]] = [orderedWords[j], orderedWords[i]];
    }
  }
  return { words: orderedWords, sourceWords, randomOrder, attempt, index: 0, phase: 'practice', answer: '', reason: null };
}

function submitAnswer(round, answer) {
  if (round.phase !== 'practice') return round;
  const result = checkAnswer(answer, round.words[round.index].german);
  if (result.reason === 'empty') return round;
  if (!result.correct) return { ...round, phase: 'failed', answer: normalize(answer), reason: result.reason };
  const index = round.index + 1;
  return { ...round, index, phase: index === round.words.length ? 'complete' : 'practice' };
}

globalThis.GloseovingCore = Object.freeze({ normalize, parseWords, checkAnswer, createRound, submitAnswer });
})();

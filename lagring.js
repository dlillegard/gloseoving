(() => {
'use strict';

const key = 'gloseoving.list.v2';
function loadList() {
  try { return localStorage.getItem(key) ?? ''; } catch { return ''; }
}
function saveList(text) {
  try {
    if (text) localStorage.setItem(key, text);
    else localStorage.removeItem(key);
    return true;
  } catch { return false; }
}

globalThis.GloseovingStorage = Object.freeze({ loadList, saveList });
})();

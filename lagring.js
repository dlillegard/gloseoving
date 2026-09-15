const key = 'gloseoving.list.v2';
export function loadList() {
  try { return localStorage.getItem(key) ?? ''; } catch { return ''; }
}
export function saveList(text) {
  try {
    if (text) localStorage.setItem(key, text);
    else localStorage.removeItem(key);
    return true;
  } catch { return false; }
}

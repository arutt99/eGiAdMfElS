// Art style switch for the inked storybook test. Read once at load; changing it reloads the page.
const KEY = 'lanternfall.artStyle';

function read() {
  try {
    const q = new URLSearchParams(location.search).get('style');
    if (q) return q !== 'classic';
    return localStorage.getItem(KEY) !== 'classic';
  } catch {
    return true;
  }
}

/** True when the inked storybook look is active. */
export const INK = read();

export function setArtStyle(ink: boolean) {
  try {
    localStorage.setItem(KEY, ink ? 'ink' : 'classic');
  } catch { /* Storage may be unavailable; the choice then lasts only until reload. */ }
  location.reload();
}

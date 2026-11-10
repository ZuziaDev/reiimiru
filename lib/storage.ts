// Küçük localStorage yardımcıları. Hata verirse (gizli mod, kapalı depolama) sessizce varsayılana döner.
// Aynı sekmede değişiklikleri yaymak için özel bir olay kullanılır.

const EVENT = "reiimiru-storage";

export function getItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* yoksay */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribe(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function readNumber(key: string): number {
  return Number(getItem(key)) || 0;
}

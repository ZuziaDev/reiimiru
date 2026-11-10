// Kedi sesleri. Dosyalar public/sounds altında.
// Tarayıcı, kullanıcı etkileşimi olmadan sesi çalmayabilir: hatalar sessizce yutulur.

export const MEOW_SOUNDS = [
  "/sounds/miyav-2.mp3",
  "/sounds/miyav-3.mp3",
  "/sounds/miyav-4.mp3",
  "/sounds/miyav-5.mp3",
];

export const PURR_SOUND = "/sounds/mirilti.mp3";

/** Nadir ses: her miyavlamada %10 ihtimalle çalar. */
export const RARE_MEOW_SOUND = "/sounds/miyav-nadir.mp3";
const RARE_CHANCE = 0.1;

let lastMeow = -1;

/** Rastgele bir miyavlama sesi çal (aynısı art arda gelmesin). %10 ihtimalle nadir ses. */
export function playMeow(volume = 0.6) {
  let src: string;
  if (Math.random() < RARE_CHANCE) {
    src = RARE_MEOW_SOUND;
  } else {
    let i = Math.floor(Math.random() * MEOW_SOUNDS.length);
    if (i === lastMeow) i = (i + 1) % MEOW_SOUNDS.length;
    lastMeow = i;
    src = MEOW_SOUNDS[i];
  }
  const a = new Audio(src);
  a.volume = volume;
  a.play().catch(() => {});
}

/** Mırıltı: döngüde çalar, durdurmak için dönen nesneyi pause et. */
export function startPurr(volume = 0.25): HTMLAudioElement {
  const a = new Audio(PURR_SOUND);
  a.loop = true;
  a.volume = volume;
  a.play().catch(() => {});
  return a;
}

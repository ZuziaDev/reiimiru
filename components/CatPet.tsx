"use client";

import { useEffect, useRef, useState } from "react";
import { playMeow, startPurr } from "@/lib/sounds";

// Sayfada gezinen kedi: yürür, oturur, uyur, miyavlar, kendini yalar, iple oynar.
// Miyavlarken ses çalar, uyurken mırıldar. Tıklanınca miyavlar ya da uyanır.
// Hareket azaltma açıksa yürümez, oturur.

type Mode = "walk" | "sit" | "sleep" | "meow" | "groom" | "play";

const CAT_W = 120;
const SPEED = 70; // px / sn

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function CatPet() {
  const elRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const reduceRef = useRef(false);
  const movingRef = useRef(false);

  const [mode, setMode] = useState<Mode>("sit");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [bubble, setBubble] = useState<string | null>(null);
  const [walkFrame, setWalkFrame] = useState(0);
  const [moving, setMoving] = useState(false);
  // Görünen durum: hareket varsa her zaman yürüyüş
  const shown: Mode = moving ? "walk" : mode;

  // Yürüyüş: 12 kare, sprite sheet üzerinde sırayla (4 sütun x 3 satır)
  useEffect(() => {
    if (!moving) return;
    const id = window.setInterval(() => setWalkFrame((f) => (f + 1) % 12), 70);
    return () => window.clearInterval(id);
  }, [moving]);

  // Uyurken mırıltı
  useEffect(() => {
    if (shown !== "sleep") return;
    const purr = startPurr();
    return () => purr.pause();
  }, [shown]);

  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    xRef.current = Math.max(16, window.innerWidth - CAT_W - 48);
    let alive = true;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => alive && fn(), ms));
    };

    const maxX = () => Math.max(16, window.innerWidth - CAT_W - 16);
    let walkDone: (() => void) | null = null;

    const meow = (text: string) => {
      setMode("meow");
      setBubble(text);
      playMeow();
      later(1700, () => setBubble(null));
    };

    // Kedi davranışı: rastgele bir eylem seç, bitince sonrakini planla
    const next = () => {
      if (!alive) return;
      const r = Math.random();
      if (reduceRef.current || r < 0.3) {
        setMode("sit");
        later(rand(2500, 4500), next);
      } else if (r < 0.55) {
        const t = rand(16, maxX());
        targetRef.current = t;
        // Sprite sola bakıyor: sağa giderken çevrilir
        setFacing(t > xRef.current ? -1 : 1);
        movingRef.current = true;
        setMoving(true);
        walkDone = next; // varış rAF döngüsünde algılanır
      } else if (r < 0.66) {
        setMode("sleep");
        later(rand(6000, 10000), () => {
          setMode("sit");
          later(rand(800, 1500), next);
        });
      } else if (r < 0.76) {
        meow("Miyav~");
        later(rand(2000, 3000), next);
      } else if (r < 0.88) {
        // İp ile oyun: kedi sağa döner, top yuvarlanır, kedi üstüne atlar
        setFacing(-1);
        setMode("play");
        later(rand(4000, 6000), () => {
          setMode("sit");
          later(rand(800, 1500), next);
        });
      } else {
        setMode("groom");
        later(rand(2200, 3200), next);
      }
    };

    // Yürüme döngüsü
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - (lastRef.current || now)) / 1000);
      lastRef.current = now;
      const t = targetRef.current;
      if (t !== null) {
        const dir = Math.sign(t - xRef.current);
        const step = dir * SPEED * dt;
        if (Math.abs(t - xRef.current) <= Math.abs(step)) {
          xRef.current = t;
          targetRef.current = null;
          const cb = walkDone;
          walkDone = null;
          movingRef.current = false;
          setMoving(false);
          setMode("sit");
          if (cb) later(rand(1200, 2500), cb);
        } else {
          xRef.current += step;
        }
      }
      xRef.current = Math.min(xRef.current, maxX());
      if (elRef.current) {
        elRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    let raf = requestAnimationFrame(frame);

    const onResize = () => {
      xRef.current = Math.min(xRef.current, maxX());
    };
    window.addEventListener("resize", onResize);

    later(rand(1500, 3000), next);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Tıklama: yürürken sadece miyavlar, değilse miyavlar ve oturur
  const onClick = () => {
    setBubble("Miyav~");
    playMeow();
    window.setTimeout(() => setBubble(null), 1500);
    if (movingRef.current) return;
    setMode("meow");
    window.setTimeout(() => {
      if (!movingRef.current) setMode("sit");
    }, 1500);
  };

  return (
    <div ref={elRef} className="cat-pet" style={{ transform: "translate3d(0,0,0)" }}>
      {bubble && <div className="cat-bubble" role="status">{bubble}</div>}

      {shown === "play" && (
        <div className="yarn" aria-hidden="true">
          <svg viewBox="0 0 40 40" width="34" height="34">
            <circle cx="20" cy="20" r="16" fill="var(--accent)" />
            <path d="M6 14 Q20 6 34 16 M5 22 Q20 30 35 24 M10 32 Q22 10 32 8" fill="none" stroke="var(--heat)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      )}

      <button
        type="button"
        className={`cat-btn mode-${shown}`}
        onClick={onClick}
        aria-label="Kediye dokun"
      >
        {shown === "walk" ? (
          <div
            className="cat-sprite"
            aria-hidden="true"
            style={{
              backgroundPosition: `${((walkFrame % 4) * 100) / 3}% ${(Math.floor(walkFrame / 4) * 100) / 2}%`,
              transform: `scaleX(${facing})`,
            }}
          />
        ) : (
          <img
            className="cat-frame"
            src={
              shown === "sleep" ? "/cat/cat-sleep.webp"
              : shown === "meow" ? "/cat/cat-meow.webp"
              : "/cat/cat-sit.webp"
            }
            alt=""
            width={480}
            height={480}
            style={{ transform: `scaleX(${facing})` }}
          />
        )}
      </button>
    </div>
  );
}

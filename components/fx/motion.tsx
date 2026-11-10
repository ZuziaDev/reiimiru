"use client";

/**
 * Scroll motion primitives. Hareket azaltma açıksa her şey son hâlinde görünür.
 */

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type ElementType, type ReactNode } from "react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type RevealVariant = "rise" | "wipe" | "unblur" | "slide";

const from: Record<RevealVariant, Record<string, string | number>> = {
  rise: { opacity: 0, y: 28 },
  wipe: { clipPath: "inset(0 100% 0 0)" },
  unblur: { opacity: 0, filter: "blur(12px)" },
  slide: { opacity: 0, x: -36 },
};
const to: Record<RevealVariant, Record<string, string | number>> = {
  rise: { opacity: 1, y: 0 },
  wipe: { clipPath: "inset(0 0% 0 0)" },
  unblur: { opacity: 1, filter: "blur(0px)" },
  slide: { opacity: 1, x: 0 },
};

/** Bir blok görünüme girince animasyonla belirir. */
export function Reveal({
  children,
  variant = "rise",
  delay = 0,
  duration = 0.8,
  className,
  as = "div",
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "article" | "h2" | "p";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  if (reduced) {
    const Plain = as as ElementType;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      initial={from[variant]}
      whileInView={to[variant]}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </Tag>
  );
}

/** Kelimeler maskeden yükselir, sırayla. */
export function SplitText({
  text,
  className,
  as = "span",
  stagger = 0.05,
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  const Tag = as as ElementType;
  if (reduced) return <Tag className={className}>{text}</Tag>;
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.25em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, delay: i * stagger, ease: EASE_OUT }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Kaydırdıkça hafif yukarı kayar: derinlik katmanı. */
export function Parallax({
  children,
  offset = 80,
  className,
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: reduced ? 0 : y }}>{children}</motion.div>
    </div>
  );
}

/** Hero: kaydırdıkça metin solar ve yukarı çıkar. */
export function HeroFade({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity: MotionValue<number> = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { opacity, y }}>{children}</motion.div>
    </div>
  );
}

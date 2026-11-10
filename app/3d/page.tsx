import Link from "next/link";
import ThreeScene from "@/components/ThreeScene";

export const metadata = {
  title: "3D demo | reiimiru",
};

export default function ThreeDemo() {
  return (
    <main className="demo-page">
      <header className="demo-head">
        <Link href="/" className="btn btn-ghost btn-small">← Ana sayfa</Link>
        <h1>3D Demo</h1>
        <p>Fareyi hareket ettir: kamera şekerleri takip eder.</p>
      </header>
      <ThreeScene />
    </main>
  );
}

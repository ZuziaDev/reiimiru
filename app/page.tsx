import CatPet from "@/components/CatPet";
import ScrollFx from "@/components/ScrollFx";
import ThemeToggle from "@/components/ThemeToggle";
import ThreeScene from "@/components/ThreeScene";
import { HeroFade, Parallax, Reveal, SplitText } from "@/components/fx/motion";

const KICK = "https://kick.com/reiimiru";
const INSTAGRAM = "https://www.instagram.com/reiimiru/";

export default function Home() {
  return (
    <>
      <ScrollFx />

      <header className="nav" id="nav">
        <a href="#top" className="logo" aria-label="Başa dön">
          reiimiru
        </a>
        <nav className="nav-links" aria-label="Ana menü">
          <a href="#hakkimda">Hakkımda</a>
          <a href="#projeler">Projeler</a>
          <a href="#iletisim">İletişim</a>
        </nav>
        <ThemeToggle />
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero" aria-labelledby="heroTitle">
          <ThreeScene className="three-stage hero-bg" label="3D sahne: yüzen kalpler ve şekerler. Tıklayınca zıplarlar." />
          <HeroFade className="hero-text">
            <h1 id="heroTitle" className="hero-title">
              <SplitText text="Merhaba, ben" as="span" stagger={0.08} />{" "}
              <SplitText text="reiimiru" as="span" className="wiggle" stagger={0.08} />
            </h1>
            <Reveal variant="rise" delay={0.4}>
              <p className="hero-sub">Kick yayınlarım ve çalışmalarım burada.</p>
            </Reveal>
            <Reveal variant="rise" delay={0.55}>
              <div className="hero-cta">
                <a className="btn btn-primary" href={KICK} target="_blank" rel="noopener noreferrer">
                  Kick&apos;te yayında
                </a>
                <a className="btn btn-ghost" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </div>
            </Reveal>
          </HeroFade>
        </section>

        {/* HAKKIMDA */}
        <section id="hakkimda" className="section">
          <SplitText text="Hakkımda" as="h2" className="section-title" />
          <Parallax offset={40}>
            <Reveal variant="unblur" className="about-card">
              <h3 className="about-name">
                Nur <span className="about-nick">&ldquo;reiimiru&rdquo;</span>
              </h3>
              <p>
                Selam ben <span className="about-nick">Nur</span>, 21 yaşındayım. 2 yıl bilgisayar
                programcılığı okudum ama bu alanın bana uygun olmadığını anlayınca bölümü bıraktım.
              </p>
              <p>
                Bir süre profesyonel olarak concept artist olarak çalıştım, ekiplerle birlikte üretmekten
                büyük keyif aldım. Ardından, oyunlar ve insanlarla etkileşimde olmak beni çok daha fazla
                heyecanlandırmaya başladı.
              </p>
              <p>
                Bu yüzden yayıncılığa yöneldim. Şu an tüm enerjimi bu alana veriyor, içeriklerimi
                geliştirip topluluğumu büyütmek için sürekli yeni şeyler deniyorum.
              </p>
            </Reveal>
          </Parallax>
        </section>

        {/* PROJELER */}
        <section id="projeler" className="section">
          <SplitText text="Projeler" as="h2" className="section-title" />
          <Reveal variant="slide" delay={0.1} className="empty-state">
            <p>Henüz proje yok.</p>
          </Reveal>
        </section>

        {/* İLETİŞİM */}
        <section id="iletisim" className="section contact">
          <SplitText text="Bağlan" as="h2" className="section-title" />
          <Reveal variant="wipe" duration={1} className="contact-links">
            <a className="btn btn-primary" href={KICK} target="_blank" rel="noopener noreferrer">
              Kick
            </a>
            <a className="btn btn-ghost" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </Reveal>
        </section>
      </main>

      <CatPet />

      <footer className="footer">
        <p>© 2026 reiimiru</p>
      </footer>
    </>
  );
}

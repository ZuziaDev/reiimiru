"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Tatlı 3D sahne: cam gibi kalpler ve şekerler, ortam yansımaları, parıltılar.
// Fare kamerayı kaydırır, tıklayınca her şey zıplar ve yerine yumuşakça döner.
// Unmount olunca tüm kaynaklar serbest bırakılır.

const PALETTE = [0xff5fa2, 0x7ee0c3, 0xffd166, 0xb388ff, 0xff8ad8];
const COUNT = 34;

// Kalp şekli (2D) -> ExtrudeGeometry ile 3D
function heartGeometry(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, -1);
  s.bezierCurveTo(-0.2, -0.6, -1, -0.3, -1, 0.3);
  s.bezierCurveTo(-1, 0.85, -0.5, 1.1, 0, 0.6);
  s.bezierCurveTo(0.5, 1.1, 1, 0.85, 1, 0.3);
  s.bezierCurveTo(1, -0.3, 0.2, -0.6, 0, -1);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.35,
    bevelEnabled: true,
    bevelThickness: 0.18,
    bevelSize: 0.18,
    bevelSegments: 4,
    curveSegments: 24,
  });
  g.center();
  return g;
}

type Floater = {
  mesh: THREE.Mesh;
  home: THREE.Vector3;
  vel: THREE.Vector3;
  speed: number;
  phase: number;
  spin: THREE.Vector3;
};

type Props = { className?: string; label?: string };

export default function ThreeScene({
  className = "three-stage",
  label = "3D sahne: yüzen kalpler ve şekerler. Tıklayınca zıplarlar.",
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = () => mount.clientWidth;
    const height = () => mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width(), height());
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Cam yansımaları için ortam haritası (kod içi, dış dosya yok)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(50, width() / height(), 0.1, 100);
    camera.position.set(0, 0, 14);

    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(5, 8, 10);
    const rim = new THREE.DirectionalLight(0xff8ad8, 1.6);
    rim.position.set(-8, -4, -6);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.35));

    // Geometriler
    const heartGeo = heartGeometry();
    const candyGeo = new THREE.IcosahedronGeometry(1, 3);

    // Malzeme: hafif cam kaplama (clearcoat), şekerimsi
    const floaters: Floater[] = [];
    const matCache = PALETTE.map(
      (c) =>
        new THREE.MeshPhysicalMaterial({
          color: c,
          roughness: 0.25,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.12,
          sheen: 0.2,
          sheenColor: new THREE.Color(0xffffff),
        }),
    );

    for (let i = 0; i < COUNT; i++) {
      const isHeart = i % 5 < 3; // %60 kalp, %40 şeker
      const mat = matCache[i % matCache.length];
      const mesh = new THREE.Mesh(isHeart ? heartGeo : candyGeo, mat);
      const s = (isHeart ? 0.55 : 0.6) + Math.random() * 0.55;
      mesh.scale.setScalar(s);

      const home = new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 13,
        (Math.random() - 0.5) * 9,
      );
      mesh.position.copy(home);
      // Kalpler ön yüzü kameraya dönük başlasın, şekerler serbest dönsün
      mesh.rotation.set(
        isHeart ? (Math.random() - 0.5) * 0.8 : Math.random() * 6,
        isHeart ? (Math.random() - 0.5) * 0.8 : Math.random() * 6,
        Math.random() * 6,
      );
      scene.add(mesh);

      floaters.push({
        mesh,
        home,
        vel: new THREE.Vector3(),
        speed: 0.35 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01,
        ),
      });
    }

    // Parıltılar (küçük noktalar)
    const sparkCount = 180;
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = (Math.random() - 0.5) * 30;
      sparkPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.09,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    // Fare: kamera takibi
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Tıklama: herkes merkezden dışa zıplar, sonra yaya gibi geri döner
    const onClick = () => {
      if (reduce) return;
      for (const f of floaters) {
        const dir = f.home.clone().normalize().multiplyScalar(0.6);
        f.vel.add(dir.add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.4, 0)));
      }
    };
    mount.addEventListener("click", onClick);

    const onResize = () => {
      renderer.setSize(width(), height());
      camera.aspect = width() / height();
      camera.updateProjectionMatrix();
    };
    // Konteyner boyutu layout sonrası değişebilir: ResizeObserver ile takip et
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);
    onResize();

    let raf = 0;
    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // Kamera: fareye yumuşak takip + hafif nefes
      camera.position.x += (pointer.x * 1.6 - camera.position.x) * 0.04;
      camera.position.y += (pointer.y * 1.0 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      for (const f of floaters) {
        if (!reduce) {
          // Yay: ev konumuna dönüş (spring) + sürtünme
          tmp.copy(f.home);
          tmp.y += Math.sin(t * f.speed + f.phase) * 0.7;
          const pull = (tmp.clone().sub(f.mesh.position)).multiplyScalar(2.2 * dt);
          f.vel.add(pull);
          f.vel.multiplyScalar(Math.pow(0.04, dt));
          f.mesh.position.add(f.vel.clone().multiplyScalar(dt * 6));
          f.mesh.rotation.x += f.spin.x;
          f.mesh.rotation.y += f.spin.y;
          f.mesh.rotation.z += f.spin.z;
        } else {
          f.mesh.position.copy(f.home);
        }
      }

      sparks.rotation.y = t * 0.02;
      sparks.rotation.x = Math.sin(t * 0.1) * 0.05;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      mount.removeEventListener("click", onClick);
      matCache.forEach((m) => m.dispose());
      heartGeo.dispose();
      candyGeo.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={mountRef} className={className} role="img" aria-label={label} />
  );
}

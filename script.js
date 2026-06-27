/* ============================================================
   SHRIDHAR KAMATH — PORTFOLIO SCRIPT
   Liquid Rain · 4D Hero · Hacker Aesthetic
   ============================================================ */

/* ─── LIQUID MATRIX RAIN ─── */
(function liquidRain() {
  const canvas = document.getElementById('rain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  const fontSize = 13;
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ{}<>[]|/\\=+#@$%&*!?';
  const charArr = chars.split('');

  let cols = Math.floor(W / fontSize);
  let drops = Array.from({ length: cols }, () => Math.random() * -100);

  // color palette: cyan, violet, green
  const palette = [
    'rgba(0,255,209,',
    'rgba(123,92,250,',
    'rgba(0,255,136,',
    'rgba(170,255,0,',
  ];
  const dropColor = drops.map(() => palette[Math.floor(Math.random() * palette.length)]);

  function draw() {
    ctx.fillStyle = 'rgba(2,5,16,0.1)';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < drops.length; i++) {
      const ch = charArr[Math.floor(Math.random() * charArr.length)];
      const y = drops[i] * fontSize;

      // Leading glyph: bright white
      if (drops[i] > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
        ctx.fillText(ch, i * fontSize, y);
      }

      // Trail glyphs: colored fade
      const trailChar = charArr[Math.floor(Math.random() * charArr.length)];
      const alpha = 0.5 + Math.random() * 0.4;
      ctx.fillStyle = dropColor[i] + alpha + ')';
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
      ctx.fillText(trailChar, i * fontSize, y - fontSize);

      // Reset
      if (y > H && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5 + Math.random() * 0.5;
    }
  }

  setInterval(draw, 40);

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    cols = Math.floor(W / fontSize);
    drops = Array.from({ length: cols }, () => Math.random() * -100);
  });
})();

/* ─── LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 1600);
});

/* ─── SPLIT HERO NAME INTO CHARS ─── */
(function splitHeroName() {
  const el = document.querySelector('.hero-name');
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = '';
  const words = text.split(' ');
  let i = 0;
  words.forEach((word, wIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    word.split('').forEach(ch => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.style.opacity = '0';
      span.style.transform = 'translateY(50px) rotateX(-70deg) scale(0.8)';
      span.style.transition = `opacity 0.7s cubic-bezier(.2,.8,.2,1) ${0.5 + i * 0.04}s, transform 0.7s cubic-bezier(.2,.8,.2,1) ${0.5 + i * 0.04}s`;
      wordSpan.appendChild(span);
      i++;
    });
    el.appendChild(wordSpan);
    if (wIndex < words.length - 1) {
      const space = document.createElement('span');
      space.className = 'char';
      space.innerHTML = '&nbsp;';
      space.style.opacity = '0';
      space.style.transition = `opacity 0.6s ease ${0.5 + i * 0.04}s`;
      el.appendChild(space);
      i++;
    }
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.querySelectorAll('.char').forEach(span => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0) rotateX(0) scale(1)';
      });
    });
  });
})();

/* ─── CUSTOM CURSOR ─── */
(function customCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .tilt-card, .timeline-item, input, textarea, .tool-chip').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

/* ─── THREE.JS HERO SCENE — 4D NETWORK SPHERE ─── */
(function heroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const hero = document.getElementById('hero');
  let W = hero.clientWidth, H = hero.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
  camera.position.set(0, 0, 34);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  const group = new THREE.Group();
  scene.add(group);

  // ── Icosahedron wireframe core (multi-layer)
  const makeCore = (r, detail, color, opacity) => {
    const geo = new THREE.IcosahedronGeometry(r, detail);
    const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });
    return new THREE.Mesh(geo, mat);
  };

  const core1 = makeCore(7, 1, 0x00FFD1, 0.30);
  const core2 = makeCore(7.6, 0, 0x7B5CFA, 0.15);
  const core3 = makeCore(9.2, 0, 0x00FFD1, 0.06);
  group.add(core1, core2, core3);

  // ── Particle field (network nodes)
  const particleCount = 320;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const cyan = new THREE.Color(0x00FFD1);
  const violet = new THREE.Color(0x7B5CFA);
  const green = new THREE.Color(0x00FF88);

  for (let i = 0; i < particleCount; i++) {
    const r = 10 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    const c = [cyan, violet, green][Math.floor(Math.random() * 3)];
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.28, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true });
  const particles = new THREE.Points(pGeo, pMat);
  group.add(particles);

  // ── Connection lines (sparse cyber-network look)
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00FFD1, transparent: true, opacity: 0.07 });
  const linePositions = [];
  for (let i = 0; i < particleCount; i++) {
    if (Math.random() > 0.07) continue;
    const j = Math.floor(Math.random() * particleCount);
    linePositions.push(
      positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
      positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
    );
  }
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  group.add(new THREE.LineSegments(lGeo, lineMat));

  // ── Glowing ring (equatorial)
  const ringGeo = new THREE.TorusGeometry(11.5, 0.04, 8, 120);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00FFD1, transparent: true, opacity: 0.25 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  // ── Orbiting mini-nodes
  const orbitGeo = new THREE.SphereGeometry(0.12, 6, 6);
  const orbitMat = new THREE.MeshBasicMaterial({ color: 0x00FFD1 });
  const orbiters = [];
  for (let i = 0; i < 8; i++) {
    const m = new THREE.Mesh(orbitGeo, orbitMat.clone());
    m.userData = { angle: (i / 8) * Math.PI * 2, speed: 0.008 + Math.random() * 0.006, radius: 11 + Math.random() * 3 };
    group.add(m);
    orbiters.push(m);
  }

  let targetRotX = 0, targetRotY = 0, mouseNX = 0, mouseNY = 0;
  let scrollFade = 1;

  document.addEventListener('mousemove', e => {
    mouseNX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotY = mouseNX * 0.35;
    targetRotX = mouseNY * 0.2;
  });

  window.addEventListener('scroll', () => {
    scrollFade = Math.max(0, 1 - window.scrollY / (H * 0.85));
  }, { passive: true });

  window.addEventListener('resize', () => {
    W = hero.clientWidth; H = hero.clientHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });

  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    // Main group rotation + mouse parallax
    group.rotation.y += 0.0018;
    group.rotation.x += (targetRotX * 0.5 - group.rotation.x) * 0.03;
    group.rotation.y += (targetRotY * 0.4 - group.rotation.y) * 0.01;

    // Inner cores counter-rotate
    core1.rotation.y -= 0.001;
    core2.rotation.x += 0.0008;
    core3.rotation.z += 0.0005;

    // Particles slow drift
    particles.rotation.y += 0.0005;
    particles.rotation.x -= 0.0003;

    // Ring pulse opacity
    ringMat.opacity = 0.18 + Math.sin(t * 1.2) * 0.1;

    // Orbiters
    orbiters.forEach(o => {
      o.userData.angle += o.userData.speed;
      o.position.x = Math.cos(o.userData.angle) * o.userData.radius;
      o.position.z = Math.sin(o.userData.angle) * o.userData.radius;
      o.position.y = Math.sin(o.userData.angle * 0.5) * 3;
    });

    // Camera parallax
    camera.position.x += (mouseNX * 2 - camera.position.x) * 0.015;
    camera.position.y += (-mouseNY * 1.2 - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);

    // Breathe scale
    group.scale.setScalar(0.93 + Math.sin(t * 0.5) * 0.02);

    renderer.domElement.style.opacity = scrollFade;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ─── 3D TILT ON CARDS ─── */
(function tiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const bounds = card.getBoundingClientRect();
      const cx = (e.clientX - bounds.left) / bounds.width - 0.5;
      const cy = (e.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-cy * 12}deg) rotateY(${cx * 12}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
  });
})();

/* ─── COUNTER ANIMATION ─── */
function animateCounters() {
  document.querySelectorAll('.metric-value[data-target]').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.closest('#dashboard')) {
        setTimeout(animateCounters, 300);
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── TIMELINE TOGGLE ─── */
function toggleTimeline(el) {
  const details = el.querySelector('.timeline-details');
  const toggle = el.querySelector('.timeline-toggle');
  const isOpen = details.classList.toggle('open');
  toggle.textContent = isOpen ? '▾ Hide details' : '▸ View details';
}

/* ─── MOBILE NAV ─── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-nav').classList.toggle('open');
});
function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
}

/* ─── CONTACT FORM ─── */
function handleContact() {
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const msg = document.getElementById('contact-msg').value;
  if (!name || !email || !msg) {
    alert('[ERROR] All fields required.');
    return;
  }
  alert('[SUCCESS] Message transmitted. Response incoming.');
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-email').value = '';
  document.getElementById('contact-msg').value = '';
}

/* ─── ACTIVE NAV ON SCROLL ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 120) {
      const id = section.getAttribute('id');
      navLinks.forEach(a => {
        const isActive = a.getAttribute('href') === '#' + id;
        a.style.color = isActive ? 'var(--cyan)' : '';
        a.style.textShadow = isActive ? '0 0 10px var(--cyan)' : '';
      });
    }
  });
}, { passive: true });

/* ─── GLITCH on hero name hover ─── */
(function heroGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;
  const glitchChars = '!<>-_\\/[]{}—=+*^?#@$%&';

  name.addEventListener('mouseenter', () => {
    const chars = name.querySelectorAll('.char');
    chars.forEach(ch => {
      if (Math.random() > 0.7) {
        const original = ch.textContent;
        let count = 0;
        const interval = setInterval(() => {
          ch.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
          count++;
          if (count > 4) {
            ch.textContent = original;
            clearInterval(interval);
          }
        }, 50);
      }
    });
  });
})();

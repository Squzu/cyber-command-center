/* ============ LOADER ============ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 900);
});

/* ============ SPLIT HERO NAME INTO CHARS ============ */
(function splitHeroName() {
  const el = document.querySelector('.hero-name');
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
      span.style.transform = 'translateY(40px) rotateX(-60deg)';
      span.style.transition = `opacity 0.6s cubic-bezier(.2,.8,.2,1) ${0.4 + i * 0.035}s, transform 0.6s cubic-bezier(.2,.8,.2,1) ${0.4 + i * 0.035}s`;
      wordSpan.appendChild(span);
      i++;
    });
    el.appendChild(wordSpan);
    if (wIndex < words.length - 1) {
      const space = document.createElement('span');
      space.className = 'char';
      space.innerHTML = '&nbsp;';
      space.style.opacity = '0';
      space.style.transition = `opacity 0.6s ease ${0.4 + i * 0.035}s`;
      el.appendChild(space);
      i++;
    }
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.querySelectorAll('.char').forEach(span => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0) rotateX(0)';
      });
    });
  });
})();

/* ============ CUSTOM CURSOR ============ */
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
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .tilt-card, .timeline-item, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

/* ============ THREE.JS HERO SCENE ============ */
(function heroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const hero = document.getElementById('hero');
  let W = hero.clientWidth, H = hero.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
  camera.position.set(0, 0, 32);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  const group = new THREE.Group();
  scene.add(group);

  // Icosahedron wireframe core
  const coreGeo = new THREE.IcosahedronGeometry(8, 1);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x00D9FF, wireframe: true, transparent: true, opacity: 0.35 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  const coreGeo2 = new THREE.IcosahedronGeometry(8.4, 0);
  const coreMat2 = new THREE.MeshBasicMaterial({ color: 0x6A5CFF, wireframe: true, transparent: true, opacity: 0.18 });
  const core2 = new THREE.Mesh(coreGeo2, coreMat2);
  group.add(core2);

  // Orbiting particle field (network nodes)
  const particleCount = 260;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const cyan = new THREE.Color(0x00D9FF);
  const violet = new THREE.Color(0x6A5CFF);
  const radii = [];

  for (let i = 0; i < particleCount; i++) {
    const r = 11 + Math.random() * 9;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    radii.push(r);
    const c = Math.random() > 0.5 ? cyan : violet;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  // Connecting lines between some nearby nodes (sparse network look)
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00D9FF, transparent: true, opacity: 0.08 });
  const linePositions = [];
  for (let i = 0; i < particleCount; i += 1) {
    if (Math.random() > 0.08) continue;
    const j = Math.floor(Math.random() * particleCount);
    linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  // Mouse parallax target
  let targetRotX = 0, targetRotY = 0;
  let mouseNX = 0, mouseNY = 0;

  document.addEventListener('mousemove', e => {
    mouseNX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotY = mouseNX * 0.4;
    targetRotX = mouseNY * 0.25;
  });

  let scrollFade = 1;
  window.addEventListener('scroll', () => {
    const sc = window.scrollY;
    scrollFade = Math.max(0, 1 - sc / (H * 0.9));
  }, { passive: true });

  function resize() {
    W = hero.clientWidth;
    H = hero.clientHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    group.rotation.y += 0.0022;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.04;
    group.rotation.y += (targetRotY * 0.5);

    core.rotation.y -= 0.0014;
    core2.rotation.x += 0.001;

    particles.rotation.y += 0.0006;

    camera.position.x += (mouseNX * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseNY * 1.2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    group.scale.setScalar(0.94 + Math.sin(t * 0.6) * 0.015);

    renderer.domElement.style.opacity = scrollFade;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ============ 3D TILT ON CARDS ============ */
(function tiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    let bounds;
    function handleMove(e) {
      bounds = card.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const cx = x / bounds.width - 0.5;
      const cy = y / bounds.height - 0.5;
      const rotY = cx * 10;
      const rotX = -cy * 10;
      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
    function reset() {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    }
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', reset);
  });
})();

/* ============ COUNTER ANIMATION ============ */
function animateCounters() {
  document.querySelectorAll('.metric-value[data-target]').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(ease * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

/* ============ SCROLL REVEAL + COUNTERS ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.closest('#dashboard')) {
        setTimeout(animateCounters, 250);
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============ TIMELINE TOGGLE ============ */
function toggleTimeline(el) {
  const details = el.querySelector('.timeline-details');
  details.classList.toggle('open');
}

/* ============ MOBILE NAV ============ */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-nav').classList.toggle('open');
});

function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
}

/* ============ CONTACT FORM ============ */
function handleContact() {
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const msg = document.getElementById('contact-msg').value;
  if (!name || !email || !msg) {
    alert('Please fill in all fields.');
    return;
  }
  alert('Message transmitted. I\'ll respond shortly.');
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-email').value = '';
  document.getElementById('contact-msg').value = '';
}

/* ============ ACTIVE NAV ON SCROLL ============ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 100) {
      const id = section.getAttribute('id');
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + id ? 'var(--cyan)' : '';
      });
    }
  });
}, { passive: true });

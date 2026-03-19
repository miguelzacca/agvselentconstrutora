// =============================================
// AGV SELENT — ANIMATION ENGINE (Native Scroll)
// =============================================

gsap.registerPlugin(ScrollTrigger);

// =============================================
// 1. PARTICLE CANVAS (Hero Background)
// =============================================
const canvas = document.createElement('canvas');
canvas.id = 'particleCanvas';
canvas.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;`;
const heroSection = document.querySelector('.hero, .emp-hero');
if (heroSection) {
  heroSection.appendChild(canvas);
}

const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  ScrollTrigger.refresh();
});

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = -Math.random() * 0.5 - 0.1;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.life = 1;
    this.decay = Math.random() * 0.003 + 0.001;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    if (this.life <= 0 || this.y < -5) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,164,97,${this.opacity * this.life})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// =============================================
// 2. CUSTOM MAGNETIC CURSOR (Desktop only)
// =============================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (window.innerWidth > 1024 && cursor) {
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(cursor, { x: mx, y: my, duration: 0.05, ease: 'none' });
  });

  gsap.ticker.add(() => {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    gsap.set(cursorFollower, { x: fx, y: fy });
  });

  document.querySelectorAll('.btn, .project-link, .link-arrow, .nav-link').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: relX * 0.3, y: relY * 0.3, duration: 0.4, ease: 'power2.out' });
      gsap.to(cursor, { scale: 2.5, duration: 0.3 });
      gsap.to(cursorFollower, { scale: 0.5, borderColor: 'rgba(201,164,97,0.8)', duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.3)' });
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(cursorFollower, { scale: 1, borderColor: 'rgba(201,164,97,0.4)', duration: 0.3 });
    });
  });
}

// =============================================
// 3. MOBILE MENU
// =============================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  nav.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    nav.classList.remove('active');
  });
});

// =============================================
// 4. HEADER SCROLL EFFECT
// =============================================
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}, { passive: true });

document.getElementById('year').textContent = new Date().getFullYear();

// =============================================
// 5. CINEMATIC HERO INTRO
// =============================================
const isMobile = window.innerWidth <= 768;
const tl = gsap.timeline({ delay: 0.2 });

tl.fromTo('.hero-bar-top', { scaleY: 1 }, { scaleY: 0, duration: 1.2, ease: 'expo.inOut' }, 0)
  .fromTo('.hero-bar-bottom', { scaleY: 1 }, { scaleY: 0, duration: 1.2, ease: 'expo.inOut' }, 0)
  .fromTo('.hero-bg',
    { scale: 1.3, filter: 'brightness(0) blur(20px)' },
    { scale: isMobile ? 1 : 1.05, filter: 'brightness(1) blur(0px)', duration: 2, ease: 'power4.out' }, 0.3)
  .fromTo('.header',
    { y: -80, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.6)
  .fromTo('.hero-subtitle',
    { y: 40, opacity: 0, skewY: 5 },
    { y: 0, opacity: 1, skewY: 0, duration: 1, ease: 'power4.out' }, 0.9)
  .fromTo('.title-line',
    { y: '110%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, 1.1)
  .fromTo('.hero-desc',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 1.7)
  .fromTo('.hero-actions .btn',
    { y: 30, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.5)' }, 1.9)
  .fromTo('.scroll-indicator',
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, 2.2);

// =============================================
// 6. HERO PARALLAX ON SCROLL (desktop only)
// =============================================
if (!isMobile) {
  gsap.to('.hero-bg', {
    yPercent: 40,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  gsap.to('.hero-content', {
    yPercent: 50,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '60% top',
      scrub: 1
    }
  });
}

// =============================================
// 7. STATS COUNTER + CARDS
// =============================================
gsap.set('.stat-card', { opacity: 0, y: 80, rotateX: 30 });

ScrollTrigger.create({
  trigger: '.stats',
  start: 'top 90%',
  once: true,
  onEnter: () => {
    // Animate stat cards in
    gsap.to('.stat-card', {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power4.out',
      clearProps: 'transform'
    });

    // Animate counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2.5,
        ease: 'power3.out',
        onUpdate: function () {
          counter.textContent = Math.ceil(this.targets()[0].val);
        }
      });
    });
  }
});

// =============================================
// 8. 3D TILT CARDS
// =============================================
function init3DTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rY = ((e.clientX - cx) / (rect.width / 2)) * 12;
      const rX = -((e.clientY - cy) / (rect.height / 2)) * 10;
      gsap.to(card, {
        rotateX: rX, rotateY: rY,
        transformPerspective: 800,
        transformOrigin: 'center center',
        duration: 0.4, ease: 'power2.out'
      });
      const sheen = card.querySelector('.card-sheen');
      if (sheen) {
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        sheen.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
      const sheen = card.querySelector('.card-sheen');
      if (sheen) sheen.style.background = 'none';
    });
  });
}
init3DTilt('.project-card');
init3DTilt('.stat-card');

// =============================================
// 9. SOBRE SECTION — CINEMATIC REVEAL
// =============================================
gsap.fromTo('.sobre-image-wrapper', {
  clipPath: 'inset(100% 0% 0% 0%)', y: 80
}, {
  clipPath: 'inset(0% 0% 0% 0%)', y: 0,
  duration: 1.4, ease: 'expo.out',
  scrollTrigger: { trigger: '.sobre', start: 'top 70%' }
});

gsap.to('.sobre-img', {
  yPercent: -15, ease: 'none',
  scrollTrigger: {
    trigger: '.sobre',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 2
  }
});

gsap.from('.experience-badge', {
  scale: 0, rotation: -90, opacity: 0,
  duration: 1.2, delay: 0.5, ease: 'elastic.out(1, 0.4)',
  scrollTrigger: { trigger: '.sobre', start: 'top 65%' }
});

gsap.from('.sobre-content > *', {
  x: 60, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out',
  scrollTrigger: { trigger: '.sobre', start: 'top 68%' }
});

// =============================================
// 10. EMPREENDIMENTOS — STAGGER 3D REVEAL
// =============================================
gsap.from('.section-header.center > *', {
  y: 60, opacity: 0, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: '.empreendimentos', start: 'top 80%' }
});

gsap.from('.project-card', {
  y: 120, opacity: 0, rotateY: 15, rotateX: 10,
  transformPerspective: 1000,
  duration: 1.2, stagger: 0.18, ease: 'power4.out',
  scrollTrigger: { trigger: '.projects-grid', start: 'top 78%' }
});

// =============================================
// 11. OPORTUNIDADES
// =============================================
gsap.to('.oportunidades-bg', {
  yPercent: 25, ease: 'none',
  scrollTrigger: {
    trigger: '.oportunidades',
    start: 'top bottom', end: 'bottom top', scrub: 2
  }
});

gsap.from('.oportunidades-container > *', {
  y: 60, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
  scrollTrigger: { trigger: '.oportunidades', start: 'top 70%' }
});

// =============================================
// 12. CONTATO
// =============================================
gsap.from('.contact-info > *', {
  x: -70, opacity: 0, duration: 1, stagger: 0.12, ease: 'power4.out',
  scrollTrigger: { trigger: '.contato', start: 'top 72%' }
});

gsap.fromTo('.contact-form-container', {
  x: 70, opacity: 0, rotateY: 20, transformPerspective: 1200
}, {
  x: 0, opacity: 1, rotateY: 0, duration: 1.4, ease: 'expo.out',
  scrollTrigger: { trigger: '.contato', start: 'top 72%' }
});

// =============================================
// 13. HORIZONTAL PROGRESS BAR
// =============================================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0;
  height: 2px; width: 0%;
  background: linear-gradient(to right, #c9a461, #e0b872, #c9a461);
  z-index: 9999; pointer-events: none;
  box-shadow: 0 0 10px rgba(201,164,97,0.6);
  transition: width 0.1s linear;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

// =============================================
// 14. LOGO GLITCH ON HOVER
// =============================================
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('mouseenter', () => {
    gsap.timeline()
      .to(logo, { skewX: 5, x: 3, duration: 0.05 })
      .to(logo, { skewX: -4, x: -2, duration: 0.05 })
      .to(logo, { skewX: 2, x: 1, duration: 0.05 })
      .to(logo, { skewX: 0, x: 0, duration: 0.1 });
  });
}

// =============================================
// 15. FOOTER REVEAL
// =============================================
gsap.from('.footer', {
  opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
  scrollTrigger: { trigger: '.footer', start: 'top 95%' }
});

// =============================================
// 16. ACTIVE NAV LINKS ON SCROLL
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`)
          link.classList.add('active');
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

// =============================================
// 17. SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});


// =============================================
// 18. EMPREENDIMENTO DYNAMICS
// =============================================
if (document.body.classList.contains('empreendimento-page')) {
  const iconMap = {
    '🛏️': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>',
    '🚗': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',
    '🏊': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>',
    '🏊‍♂️': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>',
    '🌊': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>',
    '🍖': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    '🏋️': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.65 21.35a2 2 0 0 1-2.828 0l-7.072-7.071a2 2 0 1 1 2.828-2.829l7.071 7.071a2 2 0 0 1 0 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l7.071-7.071a2 2 0 1 1 2.828 2.829z"/></svg>',
    '🎥': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
    '🍷': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 15v7"/><path d="M12 15a7.5 7.5 0 0 0 7.5-7.5C19.5 4.5 18 3 12 3S4.5 4.5 4.5 7.5 6 15 12 15z"/><path d="m4.5 7.5 15 0"/></svg>',
    '🔒': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    '🌅': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6"/><path d="M8.5 4.5 10 6"/><path d="M15.5 4.5 14 6"/><path d="M22 17a10 10 0 0 0-20 0"/><path d="M22 22H2"/></svg>',
    '🧖': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 22-5.36-5.36a7.5 7.5 0 1 1 10.72 0L12 22z"/></svg>',
    '⚽': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12 9.5 9m2.5 3 2.5-3m-2.5 3v4m-5-2-4 2m14-2 4 2"/></svg>',
    '💎': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13"/><path d="M13 3l3 6-4 13"/></svg>',
    '🌴': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M12 13a3 3 0 0 0-3-3H6a6 6 0 0 1 6-6c0 1.6 1.3 3 3 3h3a6 6 0 0 1-6 6z"/></svg>',
    '🍾': '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 21 14.5 13"/><path d="M16.5 15 15 16.5 10 11.5a2.12 2.12 0 0 1 .5-3L12 7l-2-2 2-2 2 2 1.5-1.5 3 3L17 8l-2 2 2 2c.98-.32 2.06-.05 2.76.65a2.12 2.12 0 0 1-.26 3.26L16.5 15z"/><path d="m13.5 18-1.5 1.5 3 3 1.5-1.5-3-3z"/></svg>',
  };

  const projectsData = {
    esmeralda: {
      title: "Residencial Esmeralda",
      status: "Lançamento",
      location: "Meia Praia, Itapema - SC",
      delivery: "Dezembro 2026",
      desc: "<p>Inspirado na preciosidade da pedra que lhe dá nome, o Residencial Esmeralda oferece uma experiência única de moradia. Arquitetura neoclássica aliada a um design funcional e ambientes integrados.</p><p>Viva momentos inesquecíveis com sua família em uma área de lazer completa e decorada com requinte, entregando conforto e segurança no melhor bairro de Itapema.</p>",
      heroImg: "https://dwvimagesv1.b-cdn.net/1632225100495_b7600f58-27c2-41fe-aa3c-f7d819ebfa43.jpeg?width=1020&quality=100",
      highlights: [
        { value: "3", label: "Suítes" },
        { value: "2", label: "Vagas" },
        { value: "115m²", label: "Privativos" },
        { value: "2026", label: "Entrega" }
      ],
      features: [
        { icon: "🛏️", text: "3 Suítes Plenas" },
        { icon: "🚗", text: "2 Vagas de Garagem" },
        { icon: "🏊", text: "Lazer Completo Decorado" },
        { icon: "🍖", text: "Espaço Gourmet com Churrasqueira" },
        { icon: "🏋️", text: "Academia Climatizada" },
        { icon: "🎥", text: "Cinema e Salão de Jogos" }
      ],
      gallery: [
        "https://dwvimagesv1.b-cdn.net/1632225100495_b7600f58-27c2-41fe-aa3c-f7d819ebfa43.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1632225319340_44bc5d84-92e4-4974-8f0d-149702b1ee6a.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1691182312109_5637443e-f229-49c1-ab62-14a52d695f22.jpg?quality=100",
      ]
    },
    diamond: {
      title: "Residencial Diamond",
      status: "Pronto para morar",
      location: "Centro, Itapema - SC",
      delivery: "Pronto",
      desc: "<p>O Residencial Diamond reflete o que há de mais brilhante na construção civil. Uma jóia esculpida no coração de Itapema, com acabamentos impecáveis e localização privilegiada.</p><p>Ideal para quem não abre mão do conforto, conveniência e de um estilo de vida exclusivo, a apenas poucos passos do mar e cercado pela melhor infraestrutura.</p>",
      heroImg: "https://dwvimagesv1.b-cdn.net/1632225319340_44bc5d84-92e4-4974-8f0d-149702b1ee6a.jpeg?width=1020&quality=100",
      highlights: [
        { value: "4", label: "Suítes" },
        { value: "3", label: "Vagas" },
        { value: "145m²", label: "Privativos" },
        { value: "100%", label: "Concluído" }
      ],
      features: [
        { icon: "🛏️", text: "4 Suítes, sendo 1 Master" },
        { icon: "🚗", text: "3 Vagas Lado a Lado" },
        { icon: "🏋️", text: "Academia Premium e Pilates" },
        { icon: "🌊", text: "Vista Panorâmica para o Mar" },
        { icon: "🍷", text: "Adega e Espaço Whisky" },
        { icon: "🔒", text: "Portaria 24h e Biometria" }
      ],
      gallery: [
        "https://dwvimagesv1.b-cdn.net/1632225319340_44bc5d84-92e4-4974-8f0d-149702b1ee6a.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1632225100495_b7600f58-27c2-41fe-aa3c-f7d819ebfa43.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1691182312109_5637443e-f229-49c1-ab62-14a52d695f22.jpg?quality=100",
      ]
    },
    oceanview: {
      title: "Ocean View Residence",
      status: "Em obras",
      location: "Meia Praia, Itapema - SC",
      delivery: "Fevereiro 2027",
      desc: "<p>Desperte todos os dias com o som das ondas e uma vista espetacular. O Ocean View Residence é o encontro perfeito entre a natureza exuberante de Itapema e o alto padrão AGV Selent.</p><p>Um projeto pensado para proporcionar o máximo de bem-estar e contato com o mar, oferecendo sacadas generosas e plantas de altíssima adaptabilidade.</p>",
      heroImg: "https://dwvimagesv1.b-cdn.net/1691182312109_5637443e-f229-49c1-ab62-14a52d695f22.jpg?width=1020&quality=100",
      highlights: [
        { value: "3/4", label: "Suítes" },
        { value: "3", label: "Vagas" },
        { value: "160m²", label: "Privativos" },
        { value: "2027", label: "Entrega" }
      ],
      features: [
        { icon: "🛏️", text: "Opções de 3 ou 4 Suítes" },
        { icon: "🚗", text: "Até 3 Vagas de Garagem" },
        { icon: "🌅", text: "Frente Mar e Pé Direito Alto" },
        { icon: "🍷", text: "Adega e Lounge Integrado" },
        { icon: "🧖", text: "Spa Relaxante e Sauna" },
        { icon: "⚽", text: "Quadra Poliesportiva" }
      ],
      gallery: [
        "https://dwvimagesv1.b-cdn.net/1691182312109_5637443e-f229-49c1-ab62-14a52d695f22.jpg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1632225100495_b7600f58-27c2-41fe-aa3c-f7d819ebfa43.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1632225319340_44bc5d84-92e4-4974-8f0d-149702b1ee6a.jpeg?quality=100",
      ]
    },
    nizuc: {
      title: "Nizuc Residence",
      status: "OBRA CONCLUÍDA",
      location: "Itapema - SC",
      delivery: "Pronto",
      desc: "<p>Inspirado na exclusividade dos mais luxuosos resorts de Cancun, o Nizuc Residence traz para Itapema um conceito de moradia que transcende o ordinário.</p><p>Arquitetura contemporânea, áreas de lazer que parecem verdadeiros oásis e um cuidado ímpar com a qualidade construtiva, oferecendo um refúgio de paz em um dos metros quadrados mais desejados do Brasil.</p>",
      heroImg: "https://dwvimagesv1.b-cdn.net/1678449994245_13720d1c-3ac0-4dc0-a63b-55a95d06a4ac.png",
      highlights: [
        { value: "4", label: "Suítes" },
        { value: "3", label: "Vagas" },
        { value: "190m²", label: "Privativos" },
        { value: "Oásis", label: "Design" }
      ],
      features: [
        { icon: "🛏️", text: "4 Suítes Master Premium" },
        { icon: "🚗", text: "3 Vagas Livres" },
        { icon: "💎", text: "Acabamento Alto Padrão" },
        { icon: "🏊‍♂️", text: "Piscina com Borda Infinita" },
        { icon: "🌴", text: "Praça de Fogo e Solarium" },
        { icon: "🍾", text: "Salão de Festas Climatizado" }
      ],
      gallery: [
        "https://dwvimagesv1.b-cdn.net/1678449994245_13720d1c-3ac0-4dc0-a63b-55a95d06a4ac.png",
        "https://dwvimagesv1.b-cdn.net/1632225100495_b7600f58-27c2-41fe-aa3c-f7d819ebfa43.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1632225319340_44bc5d84-92e4-4974-8f0d-149702b1ee6a.jpeg?quality=100",
      ]
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  let projectId = urlParams.get('id');
  if (!projectId || !projectsData[projectId]) projectId = 'nizuc';
  const data = projectsData[projectId];

  // ── Populate Meta & Breadcrumb ──
  document.getElementById('page-title').textContent = `${data.title} - AGV Selent`;
  document.getElementById('emp-breadcrumb-name').textContent = data.title;

  // ── Populate Hero ──
  document.getElementById('emp-title').textContent = data.title;
  document.getElementById('emp-status').textContent = data.status;
  document.getElementById('emp-location').textContent = data.location;
  if (data.delivery) {
    document.getElementById('emp-delivery-block').style.display = 'inline-flex';
    document.getElementById('emp-delivery-text').textContent = "Entrega: " + data.delivery;
  }
  document.getElementById('emp-hero-img').src = data.heroImg;

  // ── Populate Description ──
  document.getElementById('emp-desc').innerHTML = data.desc;

  // ── Populate Highlights ──
  const hlCont = document.getElementById('emp-highlights');
  if (hlCont) {
    hlCont.innerHTML = data.highlights.map(h => `
      <div class="highlight-stat">
        <span class="highlight-stat-value" data-target="${h.value}">${h.value}</span>
        <span class="highlight-stat-label">${h.label}</span>
      </div>`).join('');
  }

  // ── Populate Features ──
  const featCont = document.getElementById('emp-features');
  if (featCont) {
    featCont.innerHTML = data.features.map(f => {
      const svg = iconMap[f.icon] || f.icon;
      return `<div class="feature-item">
        <span class="feature-icon">${svg}</span>
        <span class="feature-text">${f.text}</span>
      </div>`;
    }).join('');
  }

  // ════════════════════════════════════════════
  // CUSTOM CAROUSEL
  // ════════════════════════════════════════════
  const carouselTrack = document.getElementById('empCarouselTrack');
  const carouselThumbs = document.getElementById('empCarouselThumbs');
  const carouselDots = document.getElementById('empCarouselDots');
  const slideNumEl = document.getElementById('empSlideNum');
  const slideTotalEl = document.getElementById('empSlideTotal');
  const prevBtn = document.getElementById('empCarouselPrev');
  const nextBtn = document.getElementById('empCarouselNext');
  const expandBtn = document.getElementById('empExpandBtn');

  const images = data.gallery;
  let currentIndex = 0;
  let autoplayTimer = null;

  // Build slides
  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'emp-carousel-slide' + (i === 0 ? ' is-active' : '');
    slide.dataset.index = i;
    slide.innerHTML = `<img src="${src}" alt="Galeria ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}">`;
    carouselTrack.appendChild(slide);

    // thumbnail
    const thumb = document.createElement('div');
    thumb.className = 'emp-carousel-thumb' + (i === 0 ? ' is-active' : '');
    thumb.dataset.index = i;
    thumb.innerHTML = `<img src="${src}" alt="Thumb ${i + 1}">`;
    thumb.addEventListener('click', () => goTo(i));
    carouselThumbs.appendChild(thumb);

    // dot
    const dot = document.createElement('button');
    dot.className = 'emp-carousel-dot' + (i === 0 ? ' is-active' : '');
    dot.dataset.index = i;
    dot.addEventListener('click', () => goTo(i));
    carouselDots.appendChild(dot);
  });

  slideTotalEl.textContent = String(images.length).padStart(2, '0');

  function goTo(idx, skipAutoplay = false) {
    const slides = carouselTrack.querySelectorAll('.emp-carousel-slide');
    const thumbs = carouselThumbs.querySelectorAll('.emp-carousel-thumb');
    const dots = carouselDots.querySelectorAll('.emp-carousel-dot');

    // deactivate old
    slides[currentIndex].classList.remove('is-active');
    thumbs[currentIndex].classList.remove('is-active');
    dots[currentIndex].classList.remove('is-active');

    currentIndex = (idx + images.length) % images.length;

    // activate new
    slides[currentIndex].classList.add('is-active');
    thumbs[currentIndex].classList.add('is-active');
    dots[currentIndex].classList.add('is-active');

    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    slideNumEl.textContent = String(currentIndex + 1).padStart(2, '0');

    // scroll thumb into view — only scroll the thumbs container, not the page
    const thumb = thumbs[currentIndex];
    const container = carouselThumbs;
    const thumbLeft = thumb.offsetLeft;
    const thumbWidth = thumb.offsetWidth;
    const containerWidth = container.offsetWidth;
    const scrollTarget = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
    container.scrollTo({ left: scrollTarget, behavior: 'smooth' });

    if (!skipAutoplay) resetAutoplay();
  }

  function goNext() { goTo(currentIndex + 1); }
  function goPrev() { goTo(currentIndex - 1); }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  function startAutoplay() {
    autoplayTimer = setInterval(goNext, 5000);
  }
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
  startAutoplay();

  // Pause on hover
  const stage = document.querySelector('.emp-carousel-stage');
  if (stage) {
    stage.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    stage.addEventListener('mouseleave', startAutoplay);
  }

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });

  // Touch/swipe
  let touchStartX = 0;
  carouselTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carouselTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
  });

  // Click slide → open lightbox
  carouselTrack.addEventListener('click', () => openLightbox(currentIndex));
  // Expand button
  if (expandBtn) expandBtn.addEventListener('click', () => openLightbox(currentIndex));

  // ── Progress Bar ──
  const pb = document.getElementById('empProgressBar');
  if (pb) {
    window.addEventListener('scroll', () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      pb.style.width = (window.scrollY / docH * 100) + '%';
    }, { passive: true });
  }

  // ── LIGHTBOX ──
  const lightbox = document.getElementById('empLightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let lbIndex = 0;

  function openLightbox(idx) {
    lbIndex = idx;
    lbImg.src = images[lbIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => lbImg.src = '', 400);
  }

  if (lightbox) {
    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', () => { lbIndex = (lbIndex + 1) % images.length; lbImg.src = images[lbIndex]; });
    lbPrev.addEventListener('click', () => { lbIndex = (lbIndex - 1 + images.length) % images.length; lbImg.src = images[lbIndex]; });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % images.length; lbImg.src = images[lbIndex]; }
      if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + images.length) % images.length; lbImg.src = images[lbIndex]; }
    });
  }

  // ════════════════════════════════════════════
  // GSAP ANIMATIONS — EMPREENDIMENTO PAGE
  // ════════════════════════════════════════════

  // 1. Floating gold orbs behind hero
  const heroEl = document.querySelector('.emp-hero');
  if (heroEl) {
    for (let i = 0; i < 6; i++) {
      const orb = document.createElement('div');
      const size = 100 + Math.random() * 200;
      orb.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:radial-gradient(circle, rgba(201,164,97,0.18) 0%, transparent 70%);
        top:${10 + Math.random() * 70}%;
        left:${10 + Math.random() * 80}%;
        z-index:2;
        pointer-events:none;
        filter:blur(${20 + Math.random() * 30}px);
      `;
      heroEl.appendChild(orb);
      gsap.to(orb, {
        y: `${-40 - Math.random() * 60}`,
        x: `${(Math.random() - 0.5) * 60}`,
        duration: 6 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 4
      });
    }
  }

  // 2. Hero entrance — cinematic
  const heroTl = gsap.timeline({ delay: 0.15 });
  heroTl
    .from('.emp-hero-bg img', { scale: 1.18, filter: 'blur(12px)', duration: 2.2, ease: 'power3.out' })
    .from('.emp-breadcrumb', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1.8')
    .from('.emp-badge', { scale: 0.85, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' }, '-=1.4')
    .from('.emp-title', { y: 50, opacity: 0, skewY: 3, filter: 'blur(6px)', duration: 1.1, ease: 'power4.out' }, '-=1.1')
    .from('.emp-location', { x: -30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.8')
    .from('.emp-delivery', { opacity: 0, x: -20, duration: 0.6 }, '-=0.5')
    .from('.emp-hero-actions > *', { opacity: 0, y: 25, duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)' }, '-=0.4')
    .from('.scroll-indicator', { opacity: 0, y: 20, duration: 1 }, '-=0.3');

  // 3. Hero multi-layer parallax
  if (!isMobile) {
    gsap.to('.emp-hero-bg img', {
      yPercent: 25, ease: 'none',
      scrollTrigger: { trigger: '.emp-hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
    gsap.to('.emp-hero-overlay', {
      opacity: 0.4, ease: 'none',
      scrollTrigger: { trigger: '.emp-hero', start: 'top top', end: '60% top', scrub: 1 }
    });
    gsap.to('.emp-hero-content', {
      yPercent: 40, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.emp-hero', start: 'top top', end: '55% top', scrub: 1 }
    });
  }

  // 4. Highlights bar staggered
  gsap.from('.highlight-stat', {
    y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
    clearProps: 'all',
    scrollTrigger: { trigger: '.emp-highlights-bar', start: 'top 92%', once: true }
  });

  // 5. Section title reveal — simple fade+slide (safe, always fires)
  document.querySelectorAll('.emp-section-title, .section-subtitle').forEach(el => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
      clearProps: 'all',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true }
    });
  });

  // 6. emp-divider width animation
  gsap.from('.emp-divider', {
    width: 0, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: '.emp-divider', start: 'top 90%', once: true }
  });

  // 7. Details left column stagger
  gsap.from('.emp-info-left > *', {
    y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
    clearProps: 'all',
    scrollTrigger: { trigger: '.emp-details', start: 'top 80%', once: true }
  });

  // 8. Feature items — cascade from right
  gsap.from('.feature-item', {
    x: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
    clearProps: 'all',
    scrollTrigger: { trigger: '.emp-info-right', start: 'top 85%', once: true }
  });

  // Hover shimmer on feature items
  document.querySelectorAll('.feature-item').forEach(item => {
    const sheen = document.createElement('div');
    sheen.style.cssText = `
      position:absolute;inset:0;border-radius:12px;
      background:linear-gradient(105deg,transparent 40%,rgba(201,164,97,0.08) 50%,transparent 60%);
      background-size:200% 100%;background-position:200% 0;
      transition:background-position 0.6s ease;pointer-events:none;
    `;
    item.appendChild(sheen);
    item.addEventListener('mouseenter', () => sheen.style.backgroundPosition = '-200% 0');
    item.addEventListener('mouseleave', () => sheen.style.backgroundPosition = '200% 0');
  });

  // 9. Gallery header reveal
  gsap.from('.emp-gallery-header > *', {
    y: 40, opacity: 0, duration: 0.9, stagger: 0.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.emp-gallery', start: 'top 85%', once: true }
  });

  // Carousel stage entrance
  gsap.fromTo('.emp-carousel', {
    y: 80, opacity: 0
  }, {
    y: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
    scrollTrigger: { trigger: '.emp-carousel', start: 'top 90%', once: true }
  });

  // 10. Location section entrance
  gsap.from('.emp-location-desc, .emp-location-header .btn', {
    y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
    clearProps: 'all',
    scrollTrigger: { trigger: '.emp-location-section', start: 'top 88%', once: true }
  });

  // 11. Contact section — split entrance
  gsap.from('.emp-contact-desc', {
    x: -60, opacity: 0, duration: 1, ease: 'power3.out',
    clearProps: 'all',
    scrollTrigger: { trigger: '.emp-contact', start: 'top 85%', once: true }
  });
  gsap.from('.emp-phone-link', {
    x: -40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    clearProps: 'all',
    scrollTrigger: { trigger: '.emp-contact', start: 'top 85%', once: true }
  });
  gsap.fromTo('.emp-cta-card', {
    scale: 0.88, opacity: 0, rotateY: 12, transformPerspective: 1200
  }, {
    scale: 1, opacity: 1, rotateY: 0, duration: 1.2, ease: 'expo.out',
    clearProps: 'all',
    scrollTrigger: { trigger: '.emp-contact', start: 'top 85%', once: true }
  });

  // 12. CTA icon continuous rotation on hover
  const ctaIcon = document.querySelector('.emp-cta-icon');
  if (ctaIcon) {
    ctaIcon.addEventListener('mouseenter', () => gsap.to(ctaIcon, { rotate: 15, scale: 1.15, duration: 0.5, ease: 'back.out(1.7)' }));
    ctaIcon.addEventListener('mouseleave', () => gsap.to(ctaIcon, { rotate: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
  }

  // 13. Floating CTA visibility
  const cta = document.getElementById('floatingCta');
  if (cta) {
    window.addEventListener('scroll', () => {
      cta.classList.toggle('visible', window.scrollY > window.innerHeight * 0.7);
    }, { passive: true });
  }

  // 14. Magnetic hover on feature items + highlight stats
  if (typeof init3DTilt === 'function') {
    setTimeout(() => {
      init3DTilt('.highlight-stat');
      init3DTilt('.emp-cta-card');
    }, 200);
  }

  // 15. Gold scan line on sections
  document.querySelectorAll('.emp-highlights-bar, .emp-cta-card').forEach(el => {
    const scanLine = document.createElement('div');
    scanLine.style.cssText = `
      position:absolute;top:0;left:-100%;width:60%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(201,164,97,0.06),transparent);
      pointer-events:none;z-index:5;
    `;
    el.style.position = el.style.position || 'relative';
    el.appendChild(scanLine);
    gsap.to(scanLine, {
      left: '150%', duration: 2.5, ease: 'none',
      repeat: -1, repeatDelay: 4, delay: Math.random() * 3
    });
  });
}


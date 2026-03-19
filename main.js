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
document.querySelector('.hero').appendChild(canvas);

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
        onUpdate: function() {
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

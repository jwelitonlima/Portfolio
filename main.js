// ========== CORE: GSAP + ScrollTrigger + Lenis ==========
(function ready(cb) {
  document.readyState !== 'loading' ? cb() : document.addEventListener('DOMContentLoaded', cb);
})(init);

function init() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  try {
    const lenis = new Lenis({ duration: 0.95, smoothWheel: true });
    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  } catch (e) {
    console.warn('Lenis não disponível');
  }

  preloaderSequence();
}

function preloaderSequence() {
  const hello = document.getElementById('hello-word');
  const dot = document.querySelector('.hello-dot');
  const words = ["Olá", "Hello", "Hola", "Bonjour", "Hallo"];
  
  if (!hello || !dot) {
    endPreloader();
    return;
  }
  
  const tl = gsap.timeline({ onComplete: endPreloader });
  
  words.forEach((w, i) => {
    tl.add(() => hello.textContent = w)
      .fromTo(hello, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, ease: 'power3.out' })
      .to(hello, { y: -8, opacity: 0, duration: 0.26, ease: 'power2.in' }, '+=0.02')
      .to(dot, { scale: 1 + (i + 1) * 0.12, duration: 0.28, ease: 'power2.out' }, '<');
  });
}

function endPreloader() {
  const preloader = document.getElementById('preloader');
  
  if (!preloader) {
    afterLoadInit();
    return;
  }
  
  gsap.to(preloader, {
    opacity: 0,
    duration: 0.42,
    ease: 'power2.inOut',
    onComplete: () => {
      preloader.remove();
      afterLoadInit();
    }
  });
}

function afterLoadInit() {
  initImmersiveWorks();
  smoothScrollLinks();
  heroIn();
  cartierZoomEffect();
  revealSections();
  floatingMenuControl();
  brandAndNavHovers();
  hideHeroBackgroundOnScroll();
  worksBridgeTransition();
  aboutZoomRevealTypography();
  contactFooterParallax();
  formHandler();
}

// ========== SMOOTH SCROLL ==========
function smoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      if (window.lenis) {
        window.lenis.scrollTo(target, { offset: 0, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ========== HERO ENTRANCE ==========
function heroIn() {
  if (!document.querySelector('.brand-badge')) return;
  
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  tl.from('.brand-badge', { y: -16, opacity: 0, duration: 0.32 }, 0)
    .from('.top-nav a', { y: -16, opacity: 0, stagger: 0.06, duration: 0.32 }, 0.02)
    .from('.cta-card .arrow', { y: -8, opacity: 0, duration: 0.26 }, 0.1)
    .from('.cta-card-text h2', { y: 14, opacity: 0, stagger: 0.05, duration: 0.36 }, 0.12)
    .from('.cta-card-ampersand', { y: 14, opacity: 0, duration: 0.36 }, 0.14)
    .from('.name-line', { y: 30, opacity: 0, stagger: 0.08, duration: 0.5 }, 0.18);
}

// ========== CARTIER ZOOM EFFECT ==========
function cartierZoomEffect() {
  const heroName = document.getElementById('heroName');
  const hero = document.querySelector('.hero');
  
  if (!hero || !heroName) return;
  
  gsap.to(heroName, {
    scale: 8,
    opacity: 0,
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom center',
      scrub: 1.5,
      pin: '.name-wrapper',
      anticipatePin: 1
    }
  });
  
  gsap.to('.cta-wrapper', {
    opacity: 0,
    y: 50,
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom center',
      scrub: 1.5
    }
  });
}

// ========== REVEAL SECTIONS ==========
function revealSections() {
  gsap.utils.toArray('.section-reveal').forEach(section => {
    gsap.to(section, {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1
      }
    });
  });
}
// ========== MENU FLUTUANTE ==========
function floatingMenuControl() {
  const btn = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');
  const header = document.querySelector('.site-head');
  
  if (!btn || !drawer || !header) {
    console.error('Elementos não encontrados:', { btn, drawer, header });
    return;
  }
  
  console.log('Menu flutuante inicializado');
  
  // Mostrar menu após scroll
  function handleScroll() {
    const sy = window.scrollY || document.documentElement.scrollTop;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    
    console.log('Scroll position:', sy, 'Menu open:', isOpen);
    
    if (sy > 200) {
      btn.classList.add('visible');
      header.classList.add('hidden');
    } else {
      if (!isOpen) {
        btn.classList.remove('visible');
        header.classList.remove('hidden');
      }
    }
  }
  
  // Toggle do menu
  function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    const nextState = !isOpen;
    
    console.log('Toggle menu:', isOpen, '->', nextState);
    
    btn.setAttribute('aria-expanded', String(nextState));
    drawer.setAttribute('aria-hidden', String(!nextState));
    drawer.style.transform = nextState ? 'translateX(0)' : 'translateX(100%)';
    
    // Se fechar, verificar scroll
    if (!nextState) {
      setTimeout(handleScroll, 300);
    }
  }
  
  // Event listeners
  btn.addEventListener('click', toggleMenu);
  
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        toggleMenu({ preventDefault: () => {}, stopPropagation: () => {} });
      }
    });
  });
  
  // Scroll listener
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 50);
  }, { passive: true });
  
  // Inicializar
  handleScroll();
}


// ========== BRAND & NAV HOVERS ==========
function brandAndNavHovers() {
  const magnetic = (el, strength = 18) => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x / strength, y: y / strength, duration: 0.25, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power3.out' });
    });
  };
  
  const brand = document.querySelector('.brand-badge');
  if (brand) {
    const original = brand.textContent.trim();
    const swap = brand.getAttribute('data-swap') || original;
    
    brand.addEventListener('mouseenter', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(brand, { y: -2, duration: 0.15 })
        .to(brand, { opacity: 0, duration: 0.12 }, 0)
        .add(() => brand.textContent = swap, 0.08)
        .to(brand, { opacity: 1, duration: 0.16 }, 0.12);
    });
    
    brand.addEventListener('mouseleave', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(brand, { y: 0, duration: 0.18 })
        .to(brand, { opacity: 0, duration: 0.12 }, 0)
        .add(() => brand.textContent = original, 0.08)
        .to(brand, { opacity: 1, duration: 0.16 }, 0.12);
    });
    
    magnetic(brand, 20);
  }
  
  document.querySelectorAll('.nav-link').forEach(link => {
    const dot = link.querySelector('.nav-link-dot');
    
    link.addEventListener('mouseenter', () => {
      const tl = gsap.timeline();
      tl.to(link, { y: -2, duration: 0.15, ease: 'power3.out' }, 0)
        .to(dot, { opacity: 1, scale: 1, duration: 0.18, ease: 'power3.out' }, 0.02);
    });
    
    link.addEventListener('mouseleave', () => {
      const tl = gsap.timeline();
      tl.to(link, { y: 0, duration: 0.18, ease: 'power3.out' }, 0)
        .to(dot, { opacity: 0, scale: 0.5, duration: 0.16, ease: 'power2.in' }, 0);
    });
    
    magnetic(link, 22);
  });
}

// ========== HIDE HERO BG ==========
function hideHeroBackgroundOnScroll() {
  const bg = document.querySelector('.hero-bg-photo');
  const ov = document.querySelector('.hero-bg-overlay');
  
  if (!bg || !ov) return;
  
  ScrollTrigger.create({
    trigger: '#work',
    start: 'top bottom',
    end: 'top top',
    onEnter: () => {
      bg.classList.add('hide-hero-bg');
      ov.classList.add('hide-hero-bg');
    },
    onLeaveBack: () => {
      bg.classList.remove('hide-hero-bg');
      ov.classList.remove('hide-hero-bg');
    }
  });
}

// ========== WORKS BRIDGE ==========
function worksBridgeTransition() {
  const title = document.getElementById('worksTitle');
  if (!title) return;
  
  gsap.set(title, { scale: 6, opacity: 0 });
  
  gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: '#work',
      start: 'top bottom',
      end: 'top 70%',
      scrub: 1.2
    }
  })
  .to(title, { opacity: 1, duration: 0.15 }, 0)
  .to(title, { scale: 1 }, 0);
  
  gsap.timeline({
    scrollTrigger: {
      trigger: '#work',
      start: 'top 80%',
      end: 'top 20%',
      scrub: 0.5
    }
  }).to('.works-navigation', { opacity: 1, duration: 0.3 });
  
  gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1
    }
  })
  .to(title, { opacity: 0, scale: 0.5, duration: 0.3 })
  .to('.works-navigation', { opacity: 0, duration: 0.3 }, 0);
}

// ========== ABOUT ZOOM REVEAL ==========
function aboutZoomRevealTypography() {
  const section = document.querySelector('.about-zoom-reveal');
  if (!section) return;
  
  gsap.set(section, { opacity: 1 });
  
  gsap.from('.about-eyebrow', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    }
  });
  
  gsap.utils.toArray('.word-reveal').forEach(word => {
    gsap.fromTo(word,
      { scale: 0.5, opacity: 0, filter: 'blur(20px)' },
      {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: word,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.2
        }
      }
    );
  });
  
  gsap.utils.toArray('.description-block').forEach(block => {
    gsap.fromTo(block,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        }
      }
    );
  });
  
  const cols = gsap.utils.toArray('.expertise-column');
  gsap.fromTo(cols,
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-expertise',
        start: 'top 70%',
        end: 'top 30%',
        scrub: 1
      }
    }
  );
  
  gsap.fromTo('.philosophy-quote',
    { scale: 0.95, opacity: 0 },
    {
      scale: 1,
      opacity: 0.95,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-philosophy',
        start: 'top 75%',
        end: 'top 35%',
        scrub: 1.2
      }
    }
  );
}

// ========== IMMERSIVE WORKS ==========
class ImmersiveWorks {
  constructor() {
    this.currentProject = 0;
    this.projects = [];
    this.cache();
    this.bind();
    this.scrollSync();
    this.render();
  }
  
  cache() {
    this.section = document.getElementById('work');
    this.nav = document.querySelector('.works-navigation');
    this.projects = [...document.querySelectorAll('.project-preview')];
    this.dots = [...document.querySelectorAll('.project-nav-dot')];
    
    this.activeProjects = this.projects.filter(p => {
      const btn = p.querySelector('.discover-btn');
      return btn && !btn.hasAttribute('data-disabled');
    });
  }
  
  bind() {
    this.projects.forEach(preview => {
      const btn = preview.querySelector('.discover-btn');
      if (btn && !btn.hasAttribute('data-disabled')) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    });
    
    if (this.dots.length && this.activeProjects.length > 1) {
      this.dots.forEach((dot, i) => {
        dot.addEventListener('click', () => this.go(i));
      });
    }
  }
  
  scrollSync() {
    if (!this.section || !this.activeProjects.length) return;
    
    const count = this.activeProjects.length;
    for (let i = 0; i < count; i++) {
      ScrollTrigger.create({
        trigger: this.section,
        start: `top+=${i * 100}% top`,
        end: `top+=${(i + 1) * 100}% top`,
        onEnter: () => this.set(i),
        onEnterBack: () => this.set(i)
      });
    }
  }
  
  set(i) {
    this.currentProject = i;
    this.render();
  }
  
  go(i) {
    if (i < 0 || i >= this.projects.length) return;
    
    this.set(i);
    const y = this.section.offsetTop + (window.innerHeight * i);
    
    if (window.lenis) {
      window.lenis.scrollTo(y, {
        duration: 1.5,
        easing: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      });
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
  
  render() {
    this.projects.forEach((el, idx) => {
      el.classList.toggle('active', idx === this.currentProject);
    });
    
    if (this.nav) {
      if (this.activeProjects.length <= 1) {
        this.nav.style.display = 'none';
      } else {
        this.dots.forEach((d, idx) => {
          d.classList.toggle('active', idx === this.currentProject);
        });
      }
    }
  }
}

function initImmersiveWorks() {
  const container = document.querySelector('.works-immersive-container');
  if (!container) return;
  
  window.immersiveWorks = new ImmersiveWorks();
}

// ========== CONTACT PARALLAX ==========
function contactFooterParallax() {
  const section = document.querySelector('.contact-footer-parallax');
  if (!section) return;
  
  gsap.fromTo(section,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 40%',
        scrub: 1
      }
    }
  );
}

// ========== FORM HANDLER ==========
function formHandler() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.submit-button');
    btn.disabled = true;
    
    setTimeout(() => {
      btn.disabled = false;
      form.reset();
      alert('Mensagem enviada com sucesso!');
    }, 800);
  });
}

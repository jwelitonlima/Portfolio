(function ready(cb){ 
  (document.readyState!=='loading')?cb():document.addEventListener('DOMContentLoaded',cb); 
})(init);

function init(){
  console.log('🚀 Init started');
  
  if(!window.gsap || !window.ScrollTrigger){ 
    console.error('❌ GSAP/ScrollTrigger não carregados'); 
    return; 
  }
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ duration: 0.95, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  const words = ["Olá","Hello","Hola","Bonjour","Hallo"];
  const hello = document.getElementById("hello-word");
  const dot = document.querySelector(".hello-dot");
  const tlLoad = gsap.timeline({ onComplete: endPreloader });

  words.forEach((w, index)=>{
    tlLoad.add(()=> hello.textContent = w)
      .fromTo(hello,{ y:10, opacity:0 },{ y:0, opacity:1, duration:.32, ease:'power3.out'})
      .to(hello,{ y:-8, opacity:0, duration:.26, ease:'power2.in' }, "+=0.02")
      .to(dot, { scale: 1 + (index+1)*0.12, duration:.28, ease:'power2.out' }, "<");
  });

  function endPreloader(){
    gsap.to('#preloader',{ 
      opacity:0, duration:.42, ease:'power2.inOut', 
      onComplete:()=>{
        document.getElementById('preloader')?.remove();
        console.log('✅ Preloader removido');
      }
    });
    heroIn();
    cartierZoomEffect();
    revealSections();
    hamburgerShowOnScroll();
    brandAndNavHovers();
    hideHeroBackgroundOnScroll();
    worksBridgeTransition();
    worksCarouselParallax();
    aboutZoomRevealTypography();
    floatingSkillsSystem();
    contactFooterParallax();
    formHandler();
  }

  function heroIn(){
    const tl = gsap.timeline({ defaults:{ ease:'power3.out' } });
    tl.from('.brand-badge',{y:-16,opacity:0,duration:.32},0)
      .from('.top-nav a',{y:-16,opacity:0,stagger:.06,duration:.32},.02)
      .from('.cta-card .arrow',{y:-8,opacity:0,duration:.26},.1)
      .from('.cta-card-text h2',{y:14,opacity:0,stagger:.05,duration:.36},.12)
      .from('.cta-card-ampersand',{y:14,opacity:0,duration:.36},.14)
      .from('.name-line',{y:30,opacity:0,stagger:.08,duration:.5},.18);
  }

  function cartierZoomEffect(){
    const heroName = document.getElementById('heroName');
    const hero = document.querySelector('.hero');
    if(!heroName || !hero) return;
    gsap.to(heroName, {
      scale: 8,
      opacity: 0,
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom center',
        scrub: 1.5,
        pin: '.name-wrapper',
        anticipatePin: 1,
      }
    });
    gsap.to('.cta-wrapper', {
      opacity: 0,
      y: 50,
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom center',
        scrub: 1.5,
      }
    });
  }

  function revealSections(){
    const sections = gsap.utils.toArray('.section-reveal');
    sections.forEach((section) => {
      gsap.to(section, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        }
      });
    });
  }

  function hamburgerShowOnScroll(){
    const btn = document.getElementById('hamburger');
    const drawer = document.getElementById('drawer');
    const header = document.querySelector('.site-head');
    if(!btn || !drawer || !header) return;
    function controlHamburger(){
      const sy = window.scrollY || document.documentElement.scrollTop;
      const drawerAberto = btn.getAttribute('aria-expanded') === 'true';
      if(sy > 120 || drawerAberto){
        btn.style.display = 'block';
        header.classList.add('hidden');
      } else {
        btn.style.display = 'none';
        header.classList.remove('hidden');
      }
    }
    window.addEventListener('scroll', controlHamburger);
    controlHamburger();
    function toggle(){
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      drawer.setAttribute('aria-hidden', String(open));
      drawer.style.transform = open ? 'translateX(100%)':'translateX(0)';
      gsap.to('.bar-1',{ y: open ? 0 : 8, rotate: open ? 0 : 45, duration:.28, ease:'power2.out' });
      gsap.to('.bar-2',{ opacity: open ? 1 : 0, duration:.2, ease:'power2.out' });
      gsap.to('.bar-3',{ y: open ? 0 : -8, rotate: open ? 0 : -45, duration:.28, ease:'power2.out' });
      controlHamburger();
    }
    btn.addEventListener('click', toggle);
  }

  function brandAndNavHovers(){
    const magnetic = (el, strength=18)=>{
      el.addEventListener("mousemove",(e)=>{
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width/2);
        const y = e.clientY - (r.top + r.height/2);
        gsap.to(el,{x:x/strength,y:y/strength,duration:.25,ease:"power2.out"});
      });
      el.addEventListener("mouseleave",()=> gsap.to(el,{x:0,y:0,duration:.3,ease:"power3.out"}));
    };
    const brand = document.querySelector(".brand-badge");
    if(!brand) return;
    const originalText = brand.textContent.trim();
    const swapText = brand.getAttribute("data-swap") || originalText;
    brand.addEventListener("mouseenter", ()=>{
      const tl = gsap.timeline({ defaults:{ ease:"power3.out"} });
      tl.to(brand,{y:-2,duration:.15})
        .to(brand,{opacity:0,duration:.12},0)
        .add(()=> brand.textContent = swapText, 0.08)
        .to(brand,{opacity:1,duration:.16},0.12);
    });
    brand.addEventListener("mouseleave", ()=>{
      const tl = gsap.timeline({ defaults:{ ease:"power3.out"} });
      tl.to(brand,{y:0,duration:.18})
        .to(brand,{opacity:0,duration:.12},0)
        .add(()=> brand.textContent = originalText, 0.08)
        .to(brand,{opacity:1,duration:.16},0.12);
    });
    magnetic(brand, 20);
    document.querySelectorAll(".nav-link").forEach(link=>{
      const dot = link.querySelector(".nav-dot");
      link.addEventListener("mouseenter", ()=>{
        const tl = gsap.timeline();
        tl.to(link,{y:-2,duration:.15,ease:"power3.out"},0)
          .to(dot,{opacity:1,scale:1,duration:.18,ease:"power3.out"},0.02);
      });
      link.addEventListener("mouseleave", ()=>{
        const tl = gsap.timeline();
        tl.to(link,{y:0,duration:.18,ease:"power3.out"},0)
          .to(dot,{opacity:0,scale:.5,duration:.16,ease:"power2.in"},0);
      });
      magnetic(link, 22);
    });
  }

  function hideHeroBackgroundOnScroll(){
    const heroBg = document.querySelector('.hero-bg-photo');
    const heroOverlay = document.querySelector('.hero-bg-overlay');
    if(!heroBg || !heroOverlay) return;
    ScrollTrigger.create({
      trigger: '#work',
      start: 'top bottom',
      end: 'top top',
      onEnter: () => {
        heroBg.classList.add('hide-hero-bg');
        heroOverlay.classList.add('hide-hero-bg');
      },
      onLeaveBack: () => {
        heroBg.classList.remove('hide-hero-bg');
        heroOverlay.classList.remove('hide-hero-bg');
      }
    });
  }

  function worksBridgeTransition(){
    const worksTitle = document.getElementById('worksTitle');
    if(!worksTitle) return;
    gsap.set(worksTitle, { scale: 6, opacity: 0 });
    gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: '#work',
        start: 'top bottom',
        end: 'top 70%',
        scrub: 1.2
      }
    })
    .to(worksTitle, { opacity: 1, duration: 0.15 }, 0)
    .to(worksTitle, { scale: 1 }, 0);
  }

  function worksCarouselParallax(){
    const carousel = document.querySelector('.works-carousel');
    const panels = gsap.utils.toArray('.works-carousel .panel');
    if(!carousel || !panels.length) return;
    
    const scrollTween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        id: 'works-h',
        trigger: '#work',
        start: 'top top',
        end: () => '+=' + (carousel.scrollWidth - window.innerWidth),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        snap: 1 / (panels.length - 1)
      }
    });
    
    panels.forEach((panel, i) => {
      const bg = panel.querySelector('.panel-bg-parallax');
      const img = panel.querySelector('img');
      const caption = panel.querySelector('.panel-caption');
      const title = panel.querySelector('.panel-title');
      
      if(bg){
        gsap.fromTo(bg, { yPercent: -13, scale: 1.08 }, {
          yPercent: 13, scale: 1.04,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: panel,
            start: 'left center',
            end: 'right center',
            scrub: 0.9,
            containerAnimation: scrollTween
          }
        });
      }
      if(img){
        gsap.fromTo(img, { yPercent: -8, scale: 1.07 }, {
          yPercent: 8, scale: 1.01,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'left center',
            end: 'right center',
            scrub: true,
            containerAnimation: scrollTween
          }
        });
      }
      if(caption){
        gsap.fromTo(caption, { y: 54, opacity: 0 }, {
          y: 0, opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'left center',
            end: 'right center',
            scrub: true,
            containerAnimation: scrollTween
          }
        });
      }
      if(title){
        gsap.fromTo(title, { scale: 1.16, y: 18, opacity: 0 }, {
          scale: 1, y: 0, opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'left center',
            end: 'right center',
            scrub: true,
            containerAnimation: scrollTween
          }
        });
      }
    });
    
    const dotsWrap = document.querySelector('.works-ui .dots');
    const prev = document.querySelector('.works-ui .prev');
    const next = document.querySelector('.works-ui .next');
    
    if(dotsWrap){
      dotsWrap.innerHTML = panels.map((_, idx) => `<button class="dot" type="button" aria-label="Ir ao projeto ${idx+1}"></button>`).join('');
      const dots = Array.from(dotsWrap.querySelectorAll('.dot'));
      
      function setActiveByProgress(p){
        const idx = Math.round(p * (panels.length - 1));
        dots.forEach((d,i)=> d.classList.toggle('is-active', i === idx));
      }
      
      setActiveByProgress(0);
      
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top top',
        end: () => '+=' + (carousel.scrollWidth - window.innerWidth),
        scrub: 1,
        onUpdate: () => {
          const worksH = ScrollTrigger.getById('works-h');
          if(worksH) {
            setActiveByProgress(worksH.progress);
          }
        }
      });
      
      dots.forEach((d, i) => d.addEventListener('click', ()=>{
        const target = i / (panels.length - 1);
        gsap.to(scrollTween, { progress: target, duration: .6, ease: 'power2.inOut' });
      }));
    }
    
    function step(dir){
      const st = ScrollTrigger.getById('works-h');
      if(!st) return;
      const panelsMinus1 = panels.length - 1;
      const curr = Math.round(st.progress * panelsMinus1);
      const nextIndex = Math.min(panelsMinus1, Math.max(0, curr + dir));
      const target = nextIndex / panelsMinus1;
      gsap.to(scrollTween, { progress: target, duration: .6, ease: 'power2.inOut' });
    }
    
    if(prev) prev.addEventListener('click', ()=> step(-1));
    if(next) next.addEventListener('click', ()=> step(1));
  }

  function aboutZoomRevealTypography(){
    const section = document.querySelector('.about-zoom-reveal');
    if(!section) return;

    gsap.from('.about-eyebrow', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%'
      }
    });

    const words = gsap.utils.toArray('.word-reveal');
    words.forEach((word, index) => {
      gsap.fromTo(word,
        { 
          scale: 0.5,
          opacity: 0,
          filter: 'blur(20px)'
        },
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

    gsap.utils.toArray('.description-block').forEach((block, index) => {
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

    const columns = gsap.utils.toArray('.expertise-column');
    gsap.fromTo(columns,
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

  // ===== FLOATING SKILLS SYSTEM - CURSOR FOLLOWER =====
  function floatingSkillsSystem(){
    console.log('🎯 floatingSkillsSystem (Cursor Follower) iniciado');
    
    const container = document.getElementById('floatingSkills');
    const giantText = document.querySelector('.giant-text');
    
    if(!container || !giantText) {
      console.error('❌ Container ou giant-text não encontrado!');
      return;
    }
    
    console.log('✅ Elementos encontrados');

    const skillsData = [
      { name: 'HTML5', icon: '🌐', color: '#E34F26' },
      { name: 'CSS3', icon: '🎨', color: '#2563EB' },
      { name: 'JavaScript', icon: '⚡', color: '#F7DF1E' },
      { name: 'PHP', icon: '🐘', color: '#777BB3' },
      { name: 'MySQL', icon: '🗄️', color: '#00758F' },
      { name: 'Figma', icon: '✏️', color: '#A259FF' },
      { name: 'Bootstrap', icon: '🅱️', color: '#7B1FA2' },
      { name: 'Tailwind', icon: '🌊', color: '#38BDF8' },
      { name: 'UX/UI', icon: '💎', color: '#EC4899' },
      { name: 'UX Writing', icon: '✍️', color: '#FB923C' }
    ];

    let activeCard = null;
    let currentSkillIndex = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;

    function createSkillCard() {
      const skill = skillsData[currentSkillIndex];
      console.log('📦 Criando card:', skill.name);

      const card = document.createElement('div');
      card.className = 'skill-card is-cursor-follower';
      card.innerHTML = `
        <div class="skill-card-icon">${skill.icon}</div>
        <div class="skill-card-name">${skill.name}</div>
      `;

      card.style.left = `${mouseX - 60}px`;
      card.style.top = `${mouseY - 60}px`;

      container.appendChild(card);

      gsap.fromTo(card,
        {
          scale: 0.5,
          opacity: 0,
          y: 20
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(2)'
        }
      );

      return card;
    }

    function removeSkillCard(card) {
      if(!card) return;
      console.log('🗑️ Removendo card');
      
      gsap.to(card, {
        scale: 0.5,
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => card.remove()
      });
    }

    function updateCardPosition() {
      if(!activeCard || !isHovering) return;
      
      gsap.to(activeCard, {
        left: mouseX - 60,
        top: mouseY - 60,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    giantText.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY;
      
      updateCardPosition();
    });

    giantText.addEventListener('mouseenter', (e) => {
      console.log('🖱️ Mouse ENTROU no giant text');
      isHovering = true;
      
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY;
      
      if(!activeCard) {
        activeCard = createSkillCard();
      }
    });

    giantText.addEventListener('mouseleave', () => {
      console.log('🖱️ Mouse SAIU do giant text');
      isHovering = false;
      
      if(activeCard) {
        removeSkillCard(activeCard);
        activeCard = null;
        
        currentSkillIndex = (currentSkillIndex + 1) % skillsData.length;
      }
    });

    console.log('✅ Cursor Follower configurado!');
  }

  // ===== CONTACT FOOTER (SEM PARALLAX Y - CORRIGIDO) =====
  function contactFooterParallax(){
    const section = document.querySelector('.contact-footer-parallax');
    if(!section) return;

    gsap.fromTo('.contact-title',
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-headline',
          start: 'top 75%',
          end: 'top 35%',
          scrub: 1.2
        }
      }
    );

    gsap.utils.toArray('.info-block').forEach((block, index) => {
      gsap.fromTo(block,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
          }
        }
      );
    });

    const fields = gsap.utils.toArray('.field-group');
    gsap.fromTo(fields,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.premium-form',
          start: 'top 75%',
          end: 'top 40%',
          scrub: 1
        }
      }
    );

    gsap.fromTo('.submit-button',
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.submit-button',
          start: 'top 85%',
          end: 'top 55%',
          scrub: 1
        }
      }
    );

    gsap.fromTo('.contact-footer',
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-footer',
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1
        }
      }
    );
  }

  function formHandler(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.submit-button');
      const originalHTML = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<span>Enviando...</span>';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.innerHTML = '<span>Enviado! ✓</span>';
        
        gsap.to(submitBtn, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
        
        setTimeout(() => {
          form.reset();
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
        }, 2500);
      }, 1500);
    });
  }
}

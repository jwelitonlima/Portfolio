// IMMERSIVE WORKS SYSTEM - VERSÃO SIMPLIFICADA
class ImmersiveWorks {
    constructor() {
        this.currentState = 'discover';
        this.currentProject = 0;
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupScrollTriggers();
        this.showCurrentProject();
    }

    cacheElements() {
        this.worksSection = document.getElementById('work');
        this.scenes = document.querySelectorAll('.project-scene');
        this.navigation = document.querySelector('.works-navigation');
        this.loading = document.querySelector('.scene-loading');
    }

    setupEventListeners() {
        // Botões Descobrir
        document.addEventListener('click', (e) => {
            if (e.target.closest('.discover-btn')) {
                const projectId = e.target.closest('.discover-btn').dataset.project;
                this.enterProjectScene(projectId);
            }
        });

        // Botão Sair
        document.addEventListener('click', (e) => {
            if (e.target.closest('.exit-btn')) {
                this.exitProjectScene();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.currentState === 'project' && e.key === 'Escape') {
                this.exitProjectScene();
            }
        });

        // Navegação por dots
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToProject(index));
        });
    }

    setupScrollTriggers() {
        // Scroll entre projetos no estado discover
        for (let index = 0; index < 4; index++) {
            ScrollTrigger.create({
                trigger: this.worksSection,
                start: `top+=${index * 100}% top`,
                end: `top+=${(index + 1) * 100}% top`,
                onEnter: () => this.handleProjectScroll(index),
                onEnterBack: () => this.handleProjectScroll(index)
            });
        }
    }

    handleProjectScroll(index) {
        if (this.currentState === 'discover' && !this.isTransitioning) {
            this.currentProject = index;
            this.showCurrentProject();
            this.updateNavigation();
        }
    }

    showCurrentProject() {
        const allPreviews = document.querySelectorAll('.project-preview');
        allPreviews.forEach(preview => preview.classList.remove('active'));
        
        const currentPreview = document.querySelectorAll('.project-preview')[this.currentProject];
        if (currentPreview) {
            currentPreview.classList.add('active');
        }
    }

    updateNavigation() {
        const dots = this.navigation.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentProject);
        });
    }

    async enterProjectScene(projectId) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentState = 'project';
        
        // Mostrar loading
        this.loading.classList.add('active');
        
        // Encontrar cena pelo índice
        const projectIndex = this.getProjectIndex(projectId);
        const scene = this.scenes[projectIndex];
        
        if (!scene) return;
        
        // Preparar transição
        await this.prepareProjectTransition();
        
        // Executar animação de entrada
        await this.executeEnterTransition(scene, projectId);
        
        // Configurar scroll interno da cena
        this.setupSceneScroll(scene);
        
        this.isTransitioning = false;
        this.loading.classList.remove('active');
    }

    getProjectIndex(projectId) {
        const projects = ['aurora', 'zenith', 'sphere', 'pulse'];
        return projects.indexOf(projectId);
    }

    async prepareProjectTransition() {
        // Esconder elementos da página principal
        gsap.to('header, .site-head, .works-bridge, .works-navigation', {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        // Mostrar botão sair COM EFEITO FLUTUANTE
        const exitBtn = document.querySelector('.exit-btn');
        exitBtn.classList.add('floating');
        
        gsap.to(exitBtn, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
            delay: 0.5
        });
    }

    async executeEnterTransition(scene, projectId) {
        // Mostrar cena
        scene.classList.add('active');
        
        // Aplicar transição específica
        scene.classList.add(`${projectId}-transition-enter`);
        
        // Animar background
        await gsap.to(scene.querySelector('.scene-background'), {
            scale: 1,
            duration: 1.2,
            ease: 'power2.out'
        });
        
        // Aguardar fim da transição
        await new Promise(resolve => {
            setTimeout(resolve, 1400);
        });
        
        // Remover classe de transição
        scene.classList.remove(`${projectId}-transition-enter`);
    }

    setupSceneScroll(scene) {
        const background = scene.querySelector('.scene-background');
        const content = scene.querySelector('.scene-content');
        
        // Criar scroll trigger para parallax interno
        ScrollTrigger.create({
            trigger: scene,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                
                // Parallax do background
                gsap.to(background, {
                    scale: 1 + (progress * 0.1),
                    duration: 0.1
                });
                
                // Revelar conteúdo conforme scroll
                if (progress > 0.2 && !content.classList.contains('parallax-active')) {
                    content.classList.add('parallax-active');
                }
            }
        });
    }

    async exitProjectScene() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentState = 'discover';
        
        const scene = this.scenes[this.currentProject];
        
        // Esconder botão sair E REMOVER FLUTUANTE
        const exitBtn = document.querySelector('.exit-btn');
        exitBtn.classList.remove('floating');
        
        gsap.to(exitBtn, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: 'power2.in'
        });
        
        // Executar transição de saída
        await this.executeExitTransition(scene);
        
        // Mostrar elementos da página principal
        gsap.to('header, .site-head, .works-bridge, .works-navigation', {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        });
        
        this.isTransitioning = false;
    }

    async executeExitTransition(scene) {
        const projectId = this.getProjectId(this.currentProject);
        
        // Aplicar transição de saída
        scene.classList.add(`${projectId}-transition-exit`);
        
        // Aguardar animação
        await new Promise(resolve => {
            setTimeout(resolve, 1200);
        });
        
        // Resetar cena
        scene.classList.remove('active');
        scene.classList.remove(`${projectId}-transition-exit`);
        
        // Resetar elementos da cena
        const content = scene.querySelector('.scene-content');
        content.classList.remove('parallax-active');
    }

    getProjectId(index) {
        const projects = ['aurora', 'zenith', 'sphere', 'pulse'];
        return projects[index];
    }

    goToProject(index) {
        if (this.isTransitioning || index === this.currentProject) return;
        
        this.currentProject = index;
        this.showCurrentProject();
        this.updateNavigation();
        
        const scrollPosition = this.worksSection.offsetTop + (window.innerHeight * index);
        lenis.scrollTo(scrollPosition, {
            duration: 1.5,
            easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        });
    }
}

// Inicializar sistema
function initImmersiveWorks() {
    if (document.querySelector('.works-immersive-container')) {
        window.immersiveWorks = new ImmersiveWorks();
        console.log('✅ Sistema Imersivo Works inicializado - VERSÃO HTML');
    }
}

// MAIN INIT FUNCTION (mantém todas as funções originais)
(function ready(cb) {
    (document.readyState !== 'loading') ? cb() : document.addEventListener('DOMContentLoaded', cb);
})(init);

function init() {
    console.log('🚀 Init started');

    if (!window.gsap || !window.ScrollTrigger) {
        console.error('❌ GSAP/ScrollTrigger não carregados');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 0.95,
        smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(t) {
        lenis.raf(t);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const words = ["Olá", "Hello", "Hola", "Bonjour", "Hallo"];
    const hello = document.getElementById("hello-word");
    const dot = document.querySelector(".hello-dot");
    const tlLoad = gsap.timeline({ onComplete: endPreloader });

    words.forEach((w, index) => {
        tlLoad.add(() => hello.textContent = w)
            .fromTo(hello, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, ease: 'power3.out' })
            .to(hello, { y: -8, opacity: 0, duration: 0.26, ease: 'power2.in' }, "+=0.02")
            .to(dot, { scale: 1 + (index + 1) * 0.12, duration: 0.28, ease: 'power2.out' }, "<");
    });

    function endPreloader() {
        gsap.to('#preloader', {
            opacity: 0,
            duration: 0.42,
            ease: 'power2.inOut',
            onComplete: () => {
                document.getElementById('preloader')?.remove();
                console.log('✅ Preloader removido');
                
                // INICIALIZAR SISTEMA IMERSIVO
                initImmersiveWorks();
            }
        });

        smoothScrollLinks();
        heroIn();
        cartierZoomEffect();
        revealSections();
        hamburgerShowOnScroll();
        brandAndNavHovers();
        hideHeroBackgroundOnScroll();
        worksBridgeTransition();
        aboutZoomRevealTypography();
        floatingSkillsSystem();
        contactFooterParallax();
        formHandler();
    }

    function smoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    lenis.scrollTo(target, {
                        offset: 0,
                        duration: 1.2
                    });
                }
            });
        });
    }

    function heroIn() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.brand-badge', { y: -16, opacity: 0, duration: 0.32 }, 0)
            .from('.top-nav a', { y: -16, opacity: 0, stagger: 0.06, duration: 0.32 }, 0.02)
            .from('.cta-card .arrow', { y: -8, opacity: 0, duration: 0.26 }, 0.1)
            .from('.cta-card-text h2', { y: 14, opacity: 0, stagger: 0.05, duration: 0.36 }, 0.12)
            .from('.cta-card-ampersand', { y: 14, opacity: 0, duration: 0.36 }, 0.14)
            .from('.name-line', { y: 30, opacity: 0, stagger: 0.08, duration: 0.5 }, 0.18);
    }

    function cartierZoomEffect() {
        const heroName = document.getElementById('heroName');
        const hero = document.querySelector('.hero');
        if (!heroName || !hero) return;

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

    function revealSections() {
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

    function hamburgerShowOnScroll() {
        const btn = document.getElementById('hamburger');
        const drawer = document.getElementById('drawer');
        const header = document.querySelector('.site-head');

        if (!btn || !drawer || !header) return;

        btn.style.display = 'none';
        btn.style.opacity = '0';

        function controlHamburger() {
            const sy = window.scrollY || document.documentElement.scrollTop;
            const drawerAberto = btn.getAttribute('aria-expanded') === 'true';

            if (sy > 120) {
                btn.style.display = 'block';
                gsap.to(btn, { opacity: 1, duration: 0.3 });
                header.classList.add('hidden');
            } else if (!drawerAberto) {
                gsap.to(btn, { 
                    opacity: 0, 
                    duration: 0.3,
                    onComplete: () => {
                        if (window.scrollY <= 120) {
                            btn.style.display = 'none';
                        }
                    }
                });
                header.classList.remove('hidden');
            }
        }

        window.addEventListener('scroll', controlHamburger);
        controlHamburger();

        function toggle() {
            const open = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!open));
            drawer.setAttribute('aria-hidden', String(open));
            drawer.style.transform = open ? 'translateX(100%)' : 'translateX(0)';

            gsap.to('.bar-1', { y: open ? 0 : 8, rotate: open ? 0 : 45, duration: 0.28, ease: 'power2.out' });
            gsap.to('.bar-2', { opacity: open ? 1 : 0, duration: 0.2, ease: 'power2.out' });
            gsap.to('.bar-3', { y: open ? 0 : -8, rotate: open ? 0 : -45, duration: 0.28, ease: 'power2.out' });

            if (!open) {
                btn.style.display = 'block';
                btn.style.opacity = '1';
            } else {
                controlHamburger();
            }
        }

        btn.addEventListener('click', toggle);

        const drawerLinks = drawer.querySelectorAll('a');
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (btn.getAttribute('aria-expanded') === 'true') {
                    toggle();
                }
            });
        });
    }

    function brandAndNavHovers() {
        const magnetic = (el, strength = 18) => {
            el.addEventListener("mousemove", (e) => {
                const r = el.getBoundingClientRect();
                const x = e.clientX - (r.left + r.width / 2);
                const y = e.clientY - (r.top + r.height / 2);
                gsap.to(el, { x: x / strength, y: y / strength, duration: 0.25, ease: "power2.out" });
            });
            el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power3.out" }));
        };

        const brand = document.querySelector(".brand-badge");
        if (!brand) return;

        const originalText = brand.textContent.trim();
        const swapText = brand.getAttribute("data-swap") || originalText;

        brand.addEventListener("mouseenter", () => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.to(brand, { y: -2, duration: 0.15 })
                .to(brand, { opacity: 0, duration: 0.12 }, 0)
                .add(() => brand.textContent = swapText, 0.08)
                .to(brand, { opacity: 1, duration: 0.16 }, 0.12);
        });

        brand.addEventListener("mouseleave", () => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.to(brand, { y: 0, duration: 0.18 })
                .to(brand, { opacity: 0, duration: 0.12 }, 0)
                .add(() => brand.textContent = originalText, 0.08)
                .to(brand, { opacity: 1, duration: 0.16 }, 0.12);
        });

        magnetic(brand, 20);

        document.querySelectorAll(".nav-link").forEach(link => {
            const dot = link.querySelector(".nav-dot");
            link.addEventListener("mouseenter", () => {
                const tl = gsap.timeline();
                tl.to(link, { y: -2, duration: 0.15, ease: "power3.out" }, 0)
                    .to(dot, { opacity: 1, scale: 1, duration: 0.18, ease: "power3.out" }, 0.02);
            });
            link.addEventListener("mouseleave", () => {
                const tl = gsap.timeline();
                tl.to(link, { y: 0, duration: 0.18, ease: "power3.out" }, 0)
                    .to(dot, { opacity: 0, scale: 0.5, duration: 0.16, ease: "power2.in" }, 0);
            });
            magnetic(link, 22);
        });
    }

    function hideHeroBackgroundOnScroll() {
        const heroBg = document.querySelector('.hero-bg-photo');
        const heroOverlay = document.querySelector('.hero-bg-overlay');
        if (!heroBg || !heroOverlay) return;

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

    function worksBridgeTransition() {
        const worksTitle = document.getElementById('worksTitle');
        if (!worksTitle) return;

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

        // MOSTRAR NAVEGAÇÃO quando Works estiver visível
        gsap.timeline({
            scrollTrigger: {
                trigger: '#work',
                start: 'top 80%',
                end: 'top 20%',
                scrub: 0.5
            }
        })
        .to('.works-navigation', { opacity: 1, duration: 0.3 });

        gsap.timeline({
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1
            }
        })
        .to(worksTitle, { opacity: 0, scale: 0.5, duration: 0.3 })
        .to('.works-navigation', { opacity: 0, duration: 0.3 }, 0);
    }

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

        const words = gsap.utils.toArray('.word-reveal');
        words.forEach((word) => {
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

        gsap.utils.toArray('.description-block').forEach((block) => {
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

    function floatingSkillsSystem() {
        const container = document.getElementById('floatingSkills');
        const giantText = document.querySelector('.giant-text');

        if (!container || !giantText) return;

        const skillsData = [
            { name: 'HTML5', icon: '🌐' },
            { name: 'CSS3', icon: '🎨' },
            { name: 'JavaScript', icon: '⚡' },
            { name: 'PHP', icon: '🐘' },
            { name: 'MySQL', icon: '🗄️' },
            { name: 'Figma', icon: '✏️' },
            { name: 'Bootstrap', icon: '🅱️' },
            { name: 'Tailwind', icon: '🌊' },
            { name: 'UX/UI', icon: '💎' },
            { name: 'UX Writing', icon: '✍️' }
        ];

        let activeCard = null;
        let currentSkillIndex = 0;
        let mouseX = 0;
        let mouseY = 0;
        let isHovering = false;

        function createSkillCard() {
            const skill = skillsData[currentSkillIndex];
            const card = document.createElement('div');
            card.className = 'skill-card is-cursor-follower';
            card.innerHTML = `
                <div class="skill-card-icon">${skill.icon}</div>
                <div class="skill-card-name">${skill.name}</div>
            `;
            card.style.left = `${mouseX}px`;
            card.style.top = `${mouseY}px`;
            card.style.transform = 'translate(-50%, -50%) scale(0)';
            card.style.opacity = '0';
            container.appendChild(card);

            gsap.to(card, {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });

            return card;
        }

        function updateCardPosition() {
            if (activeCard && isHovering) {
                gsap.to(activeCard, {
                    left: mouseX,
                    top: mouseY,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            }
            requestAnimationFrame(updateCardPosition);
        }
        updateCardPosition();

        giantText.addEventListener('mouseenter', () => {
            isHovering = true;
            if (!activeCard) {
                activeCard = createSkillCard();
            }
        });

        giantText.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        giantText.addEventListener('mouseleave', () => {
            isHovering = false;
            if (activeCard) {
                gsap.to(activeCard, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        activeCard?.remove();
                        activeCard = null;
                        currentSkillIndex = (currentSkillIndex + 1) % skillsData.length;
                    }
                });
            }
        });
    }

    function contactFooterParallax() {
        const contactSection = document.querySelector('.contact-footer-parallax');
        if (!contactSection) return;

        gsap.from('.contact-title', {
            y: 60,
            opacity: 0,
            scrollTrigger: {
                trigger: contactSection,
                start: 'top 70%',
                end: 'top 30%',
                scrub: 1
            }
        });

        gsap.utils.toArray('.info-block').forEach((block) => {
            gsap.from(block, {
                y: 40,
                opacity: 0,
                scrollTrigger: {
                    trigger: block,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1
                }
            });
        });

        gsap.from('.premium-form', {
            y: 60,
            opacity: 0,
            scrollTrigger: {
                trigger: '.premium-form',
                start: 'top 80%',
                end: 'top 40%',
                scrub: 1
            }
        });
    }

    function formHandler() {
        const form = document.querySelector('.premium-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('.submit-button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = 'Mensagem Enviada! ✓';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }
}

// Garantir que Lenis está disponível globalmente
window.lenis = new Lenis({
    duration: 0.95,
    smoothWheel: true
});

function raf(time) {
    window.lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Fallback para caso o sistema imersivo não carregue
setTimeout(() => {
    if (!window.immersiveWorks) {
        console.warn('⚠️ Sistema imersivo não carregou');
    }
}, 3000);

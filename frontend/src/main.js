import './style.css'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VanillaTilt from 'vanilla-tilt'

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function init() {
    try {
        const response = await fetch(`${API_URL}/profile`);
        const data = await response.json();
        renderProfile(data);
    } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
        renderProfile({
            name: "Cristian Martinez",
            role: "Front-End Engineer",
            location: "Palhoça, BR",
            experience: "+2",
            projectsCount: "15+",
            bio: "Engenheiro Front-End transformando complexidade em simplicidade visual"
        });
    }
    
    setupLocalTime();
    setupAnimations();
    setupInteractivity();
    fetchRepos();
}

function renderProfile(data) {
    document.querySelectorAll('.profile-name').forEach(el => el.textContent = data.name);
    document.querySelectorAll('.profile-role').forEach(el => el.textContent = data.role);
    
    const locText = document.getElementById('local-time-suffix');
    if (locText) locText.textContent = data.location;
    
    const expText = document.getElementById('stat-exp');
    if (expText) expText.textContent = data.experience;
    
    const projText = document.getElementById('stat-projects');
    if (projText) projText.textContent = data.projectsCount;
    
    const bioText = document.getElementById('hero-bio');
    if (bioText) bioText.textContent = data.bio;
}

function setupLocalTime() {
    function updateTime() {
        const timeEl = document.getElementById('local-time');
        if (timeEl) {
            const now = new Date();
            const options = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            timeEl.textContent = now.toLocaleTimeString('pt-BR', options);
        }
    }
    setInterval(updateTime, 1000);
    updateTime();
}

function setupAnimations() {
    window.addEventListener('load', () => {
        const tl = gsap.timeline();
        
        // Reset inicial para garantir que nada fique invisível se o loader falhar
        gsap.set(".loader-logo", { opacity: 0 });
        gsap.set(".loader-text", { opacity: 0, y: 10 });
        
        gsap.set([".navbar", ".custom-cursor", ".custom-cursor-follower"], { y: -50, opacity: 0 });
        gsap.set(".profile-area", { x: -50, opacity: 0 });
        gsap.set(".hero-text > *", { y: 30, opacity: 0 });

        tl.to(".loader-logo", { opacity: 1, y: -10, duration: 0.8, ease: "power3.out" })
          .to(".loader-progress", { width: "30%", duration: 0.8, ease: "power2.inOut" }, "-=0.5")
          
          .to(".loader-logo", { opacity: 0, y: -20, duration: 0.5, ease: "power3.in", delay: 0.5 })
          
          .to(".loader-text.welcome", { opacity: 1, y: -5, duration: 0.8, ease: "power3.out" })
          .to(".loader-progress", { width: "60%", duration: 1, ease: "power2.inOut" }, "-=0.5")
          
          .to(".loader-text.welcome", { opacity: 0, y: -15, duration: 0.5, ease: "power3.in", delay: 0.5 })
          
          .to(".loader-text.bio", { opacity: 1, y: -5, duration: 0.8, ease: "power3.out" })
          .to(".loader-progress", { width: "100%", duration: 1.2, ease: "power2.inOut" }, "-=0.5")
          
          .to(".intro-loader", { 
              yPercent: -100, 
              duration: 1.2, 
              ease: "expo.inOut",
              delay: 0.5,
              onComplete: () => {
                  document.body.classList.remove('is-loading');
                  const loader = document.querySelector('.intro-loader');
                  if (loader) loader.style.display = 'none';
                  
                  gsap.to(".navbar", { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" });
                  gsap.to([".custom-cursor", ".custom-cursor-follower"], { opacity: 1, duration: 1 });
                  gsap.to(".profile-area", { x: 0, opacity: 1, duration: 1.5, ease: "power4.out" });
                  gsap.to(".hero-text > *", { y: 0, opacity: 1, stagger: 0.1, ease: "power4.out" });
                  ScrollTrigger.refresh();
              }
          });
    });

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.to(".scroll-progress", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
        }
    });

    // Floating Back to Top Logic
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.querySelector('.progress-bar');
    const dashArray = 282.7;

    if (backToTop && progressBar) {
        window.addEventListener('scroll', () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / totalHeight);
            
            // Show/Hide Button
            if (window.scrollY > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }

            // Update Progress Circle
            const offset = dashArray - (scrollPercent * dashArray);
            progressBar.style.strokeDashoffset = offset;
        });

        backToTop.addEventListener('click', () => {
            lenis.scrollTo('#hero', { 
                duration: 1.5, 
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
            });
        });
    }

    // Reveal animations
    gsap.utils.toArray('.section-header, .skill-item, .bento-item, .project-card').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: "expo.out"
        });
    });
}

function setupInteractivity() {
    // Vanilla Tilt
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.3
    });

    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.3 });

            // Background blobs effect
            gsap.to(".glow-blob", {
                x: (e.clientX - window.innerWidth / 2) * 0.05,
                y: (e.clientY - window.innerHeight / 2) * 0.05,
                duration: 2,
                ease: "power2.out"
            });
        });

        // Hover effects
        const targets = 'a, button, .skill-item, .project-card, .tilt-card-wrapper, .bento-item';
        document.querySelectorAll(targets).forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 2, background: 'rgba(255,255,255,0.8)' });
                gsap.to(follower, { scale: 1.5, opacity: 0.2 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, background: 'var(--primary)' });
                gsap.to(follower, { scale: 1, opacity: 0.5 });
            });
        });
    }

    // Magnetic Buttons
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });

    // Profile Card Flip
    const cvCard = document.querySelector('.cv-card');
    const tiltWrapper = document.querySelector('.tilt-card-wrapper');
    if (cvCard && tiltWrapper) {
        tiltWrapper.addEventListener('mouseenter', () => {
            gsap.to(cvCard, { rotateY: 180, duration: 0.8, ease: "power2.out" });
        });
        tiltWrapper.addEventListener('mouseleave', () => {
            gsap.to(cvCard, { rotateY: 0, duration: 0.8, ease: "power2.out" });
        });
    }
}

async function fetchRepos() {
    const username = 'CristianMartinezApi';
    const grid = document.getElementById('github-projects');
    if (!grid) return;

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
        const repos = await response.json();
        const filtered = repos.filter(r => !r.fork);
        
        grid.innerHTML = filtered.map(repo => `
            <div class="project-card" data-tilt>
                <div class="p-content">
                    <div class="p-header">
                        <div class="p-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                    </div>
                    <h3>${repo.name.replace(/-/g, ' ')}</h3>
                    <p>${repo.description || 'Desenvolvimento front-end escalável.'}</p>
                    <div class="p-footer">
                        <a href="${repo.html_url}" target="_blank" class="p-link">Ver Código</a>
                    </div>
                </div>
            </div>
        `).join('');
        
        VanillaTilt.init(grid.querySelectorAll(".project-card"), { max: 10, speed: 400 });
        
        // Spotlight effect for projects
        grid.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--px', `${x}%`);
                card.style.setProperty('--py', `${y}%`);
            });
        });
    } catch (e) {
        grid.innerHTML = '<p>Erro ao carregar repositórios.</p>';
    }
}

window.copyEmail = function() {
    const email = "fernandesribe04@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        const btn = document.getElementById('email-btn');
        const oldText = btn.innerText;
        btn.innerText = "Copiado! ✓";
        btn.style.background = "#22c55e";
        setTimeout(() => {
            btn.innerText = oldText;
            btn.style.background = "";
        }, 2000);
    });
}

init();

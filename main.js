import createHyperjumpAnimation from './src/hyperjumpAnimation.js';

console.log('main.js is loaded');

const sketch = (p) => {
  let hyperjumpAnimation;
  let landingPageParticles = [];

  p.setup = () => {
    console.log('Setup function called');
    p.createCanvas(p.windowWidth, p.windowHeight).parent("sketch-holder");
    hyperjumpAnimation = createHyperjumpAnimation(p);
    hyperjumpAnimation.setup();
    
    document.getElementById('loading-text').style.display = 'none';
  };

  p.draw = () => {
    hyperjumpAnimation.draw();
    drawLandingPageParticles();
  };

  function drawLandingPageParticles() {
    for (let i = landingPageParticles.length - 1; i >= 0; i--) {
      let particle = landingPageParticles[i];
      particle.update();
      particle.display();
      if (particle.isDead()) {
        landingPageParticles.splice(i, 1);
      }
    }
  }

  p.windowResized = () => {
    console.log('Window resized');
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    hyperjumpAnimation.windowResized();
  };

  window.startTransition = (callback) => {
    hyperjumpAnimation.startTransition(callback);
  };

  class Particle {
    constructor(x, y) {
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(p.random(-2, 2), p.random(-2, 2));
      this.acc = p.createVector(0, 0.1);
      this.lifetime = 255;
    }

    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.lifetime -= 2;
    }

    display() {
      p.noStroke();
      p.fill(0, 255, 127, this.lifetime);
      p.ellipse(this.pos.x, this.pos.y, 4);
    }

    isDead() {
      return this.lifetime < 0;
    }
  }

  window.createLandingPageParticles = (x, y) => {
    for (let i = 0; i < 50; i++) {
      landingPageParticles.push(new Particle(x, y));
    }
  };
};

new p5(sketch);

document.addEventListener('DOMContentLoaded', () => {
  const landingPage = document.getElementById('landing-page');
  const portfolio = document.getElementById('portfolio');
  const landingPageText = document.querySelector('#landing-page h1');
  const navLinks = document.querySelectorAll('nav a');
  const components = document.querySelectorAll('.component');

  if (landingPage && landingPageText) {
    landingPage.addEventListener('click', () => {
      const rect = landingPageText.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      window.createLandingPageParticles(centerX, centerY);

      landingPageText.style.opacity = '0';
      landingPage.style.background = 'transparent';
      
      setTimeout(() => {
        landingPage.classList.add('hidden');
        portfolio.classList.remove('hidden');
        window.startTransition(() => {
          portfolio.classList.add('visible');
        });
      }, 2000);
    });
  } else {
    console.error('Landing page or landing page text not found');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetComponent = link.getAttribute('data-component');
      
      window.startTransition(() => {
        components.forEach(component => {
          component.classList.remove('active');
        });
        document.getElementById(targetComponent).classList.add('active');
      });
    });
  });
});
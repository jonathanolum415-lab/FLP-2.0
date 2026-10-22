const page = document.body.dataset.page || "home";
const nav = document.querySelector('[data-nav]');
const backToTopBtn = document.getElementById('backToTop');
const yearSpan = document.querySelector('[data-year]');
const typewriterEl = document.querySelector('[data-typewriter]');
const servicesGrid = document.querySelector('[data-services-grid]');
const contactForm = document.querySelector('[data-contact-form]');
const mapPlaceholder = document.querySelector('[data-map]');

const servicesData = [
  {
    title: 'Immune Boost Packs',
    description: 'Targeted supplement bundles to reinforce immunity with vitamins, minerals and adaptogens.',
    cta: 'Book a consult'
  },
  {
    title: 'Detox and Cleanse Kits',
    description: 'Gentle detox programmes that reset your system and support digestive harmony.',
    cta: 'Start your reset'
  },
  {
    title: 'Weight Wellness Coaching',
    description: 'Personalised coaching, meal planning and product combos to achieve sustainable weight goals.',
    cta: 'See plans'
  },
  {
    title: 'Herbal Relief Solutions',
    description: 'Nature-derived remedies that soothe chronic discomfort and enhance daily comfort.',
    cta: 'Discover options'
  },
  {
    title: 'Energy and Performance Boosters',
    description: 'Energy drinks and supplements tailored to boost stamina and mental clarity.',
    cta: 'Charge up'
  },
  {
    title: 'Skin and Beauty Care',
    description: 'Aloe-infused skin care that hydrates, nourishes and protects from within.',
    cta: 'Glow with us'
  },
  {
    title: 'Family Wellness Packs',
    description: 'Comprehensive wellness kits designed for every member of the family.',
    cta: 'Support your family'
  },
  {
    title: 'Wellness Workshops',
    description: 'Interactive sessions that teach practical wellness routines for community groups.',
    cta: 'Join a session'
  },
  {
    title: 'Corporate Wellness Programmes',
    description: 'Tailored solutions to improve employee wellbeing and organisational productivity.',
    cta: 'Partner with us'
  }
];

const typewriter = {
  index: 0,
  text: '',
  speed: 80,
  running: false,
  async start(element) {
    if (!element || this.running) return;
    this.text = element.getAttribute('data-typewriter') || element.textContent.trim();
    element.textContent = '';
    this.running = true;

    while (this.index < this.text.length) {
      element.textContent += this.text.charAt(this.index);
      this.index += 1;
      await new Promise((resolve) => setTimeout(resolve, this.speed));
    }
    this.running = false;
  }
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2
  }
);

function observeSections() {
  document.querySelectorAll('[data-observe]').forEach((section) => observer.observe(section));
}

function highlightActiveNav() {
  if (!nav) return;
  nav.querySelectorAll('a').forEach((link) => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

function setYear() {
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

function handleBackToTop() {
  if (!backToTopBtn) return;
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  };

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleVisibility);
  toggleVisibility();
}

function populateServices() {
  if (!servicesGrid) return;
  const limit = parseInt(servicesGrid.dataset.limit || servicesData.length, 10);
  const fragment = document.createDocumentFragment();

  servicesData.slice(0, limit).forEach((service) => {
    const card = document.createElement('article');
    card.className = 'service-card';
    card.setAttribute('data-card', '');

    const title = document.createElement('h3');
    title.textContent = service.title;

    const description = document.createElement('p');
    description.textContent = service.description;

    const button = document.createElement('a');
    button.className = 'button';
    button.href = 'contacts.html';
    button.textContent = service.cta;

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(button);
    fragment.appendChild(card);
  });

  servicesGrid.innerHTML = '';
  servicesGrid.appendChild(fragment);
}

function handleContactForm() {
  if (!contactForm) return;
  const feedbackEl = contactForm.querySelector('.form-feedback');
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    feedbackEl.textContent = '';
    feedbackEl.className = 'form-feedback';

    const formData = new FormData(contactForm);
    const entries = Object.fromEntries(formData.entries());

    if (!entries.name || !entries.email || !entries.message) {
      feedbackEl.textContent = 'Please fill in all required fields.';
      feedbackEl.classList.add('error');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      feedbackEl.textContent = 'Thank you! Your message has been received. We will contact you shortly.';
      feedbackEl.classList.add('success');
      contactForm.reset();
    } catch (error) {
      feedbackEl.textContent = 'Something went wrong. Please try again later.';
      feedbackEl.classList.add('error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send message';
    }
  });
}

function enableCopyEmail() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const textToCopy = button.dataset.copy;
      const initialText = button.textContent.trim();

      try {
        await navigator.clipboard.writeText(textToCopy);
        button.classList.add('copied');
        button.textContent = 'Email copied!';
        setTimeout(() => {
          button.classList.remove('copied');
          button.textContent = initialText;
        }, 1500);
      } catch (error) {
        button.textContent = 'Copy failed';
        button.classList.add('error');
        setTimeout(() => {
          button.classList.remove('error');
          button.textContent = initialText;
        }, 1500);
      }
    });
  });
}

function initMapPlaceholder() {
  if (!mapPlaceholder) return;
  mapPlaceholder.textContent = '';
  mapPlaceholder.style.height = '320px';
  mapPlaceholder.style.borderRadius = '12px';
  mapPlaceholder.style.background =
    'linear-gradient(135deg, rgba(76, 175, 80, 0.12), rgba(76, 175, 80, 0.28))';
  mapPlaceholder.style.display = 'flex';
  mapPlaceholder.style.alignItems = 'center';
  mapPlaceholder.style.justifyContent = 'center';
  mapPlaceholder.style.color = '#256029';
  mapPlaceholder.style.fontWeight = 'bold';
  mapPlaceholder.style.fontSize = '1.1rem';
  mapPlaceholder.innerText = 'Visit us in Gulu — interactive map coming soon';
}

function registerTimelineAnimations() {
  const steps = document.querySelectorAll('[data-timeline-step]');
  if (!steps.length) return;

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.4
    }
  );

  steps.forEach((step) => timelineObserver.observe(step));
}

function init() {
  highlightActiveNav();
  setYear();
  handleBackToTop();
  observeSections();
  populateServices();
  handleContactForm();
  enableCopyEmail();
  initMapPlaceholder();
  registerTimelineAnimations();
  typewriter.start(typewriterEl);
}

document.addEventListener('DOMContentLoaded', init);

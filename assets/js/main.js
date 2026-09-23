document.addEventListener('DOMContentLoaded', () => {
  // Header shadow once the page scrolls
  const header = document.querySelector('[data-header]');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Fade sections in as they scroll into view
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 90}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Review carousel arrows
  const track = document.querySelector('[data-track]');
  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = track.querySelector('.review-card');
      const step = card ? card.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: step * Number(btn.dataset.scroll) });
    });
  });

  // Lightbox for the guide pages and reviews
  const box = document.querySelector('[data-lightbox]');
  const boxImg = box.querySelector('img');
  let items = [];
  let index = 0;
  const show = (i) => {
    index = (i + items.length) % items.length;
    boxImg.src = items[index].dataset.full;
    boxImg.alt = items[index].querySelector('img').alt;
  };
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const list = [...gallery.querySelectorAll('[data-full]')];
    list.forEach((item, i) => item.addEventListener('click', () => {
      items = list;
      show(i);
      box.showModal();
    }));
  });
  box.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => show(index + Number(b.dataset.step))));
  box.querySelector('[data-close]').addEventListener('click', () => box.close());
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
});

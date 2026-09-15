// yıl
document.getElementById('yil').textContent = new Date().getFullYear();

// SSS: aynı anda tek soru açık kalsın
const sss = document.querySelectorAll('.faq details');
sss.forEach(d => d.addEventListener('toggle', () => {
  if (d.open) sss.forEach(o => { if (o !== d) o.open = false; });
}));

// bölümleri görünürken yumuşakça getir
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const targets = document.querySelectorAll('.mode, .exam-grid li, .streak__txt, .streak__card, .stats div, .faq details');
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
      }, i * 60);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  targets.forEach(el => io.observe(el));
}

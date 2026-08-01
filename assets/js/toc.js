// Sidebar TOC — highlight current section on scroll, smooth-scroll on click.
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.toc-in-chapter a[href^="#"]');
  if (!sections.length || !links.length) return;

  const linkMap = new Map();
  links.forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    linkMap.set(id, a);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkMap.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));

  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    });
  });
})();

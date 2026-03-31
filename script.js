const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

const rocketBtn = document.getElementById('rocketBtn');

window.addEventListener('scroll', () => {
  rocketBtn.classList.toggle('visible', window.scrollY > 200);
});

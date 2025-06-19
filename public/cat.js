// 🔁 Přednačtení obrázků
const images = {
  normal: new Image(),
  tongue: new Image()
};
images.normal.src = 'cat.png';
images.tongue.src = 'cat2.png';

const cat = document.getElementById('cat');
const catContainer = document.getElementById('cat-container');
const heartMsg = document.getElementById('heart-msg');
const app = document.getElementById('app');
const heartsContainer = document.getElementById('hearts-container');

let clickCount = 0;
let isTongue = false;
let transitionDone = false;

// ⚡ Bleskové klikání pro mobil & desktop
cat.addEventListener('pointerdown', handleClick);

function handleClick(event) {
  if (transitionDone) return;
  event.stopPropagation();
  event.preventDefault?.();

  clickCount++;
  isTongue = !isTongue;
  cat.src = isTongue ? images.tongue.src : images.normal.src;

  if (clickCount < 10) {
    const heart = document.createElement('div');
    heart.className = 'meow-pop';
    heart.textContent = '❤️';

    const rect = cat.getBoundingClientRect();
    heart.style.left = `${rect.left + rect.width / 2 + (Math.random() * 40 - 20)}px`;
    heart.style.top = `${rect.top + (Math.random() * -20 - 20)}px`;

    heart.style.position = 'absolute';
    heart.style.zIndex = '9999';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  }

  if (clickCount === 10) {
    transitionDone = true;
    cat.style.display = 'none';
    heartMsg.style.display = 'block';
    heartMsg.classList.add('big-heart');

    setTimeout(() => {
      heartMsg.style.display = 'none';
      app.classList.remove('hidden');

      const paidRows = [...document.querySelectorAll('tr.paid')];
      const unpaidRows = [...document.querySelectorAll('tr.unpaid')];
      const paidSum = paidRows.reduce((sum, row) => sum + Number(row.dataset.amount), 0);
      const unpaidSum = unpaidRows.reduce((sum, row) => sum + Number(row.dataset.amount), 0);
      document.getElementById('paidAmount').textContent = paidSum.toLocaleString();
      document.getElementById('unpaidAmount').textContent = unpaidSum.toLocaleString();

      setInterval(() => {
        const fallHeart = document.createElement('div');
        fallHeart.className = 'heart';
        fallHeart.style.left = Math.random() * 100 + '%';
        fallHeart.style.fontSize = Math.random() * 20 + 10 + 'px';
        fallHeart.style.animationDuration = 6 + Math.random() * 4 + 's';
        fallHeart.textContent = '❤';
        heartsContainer.appendChild(fallHeart);
        setTimeout(() => fallHeart.remove(), 10000);
      }, 400);
    }, 2000);
  }
}

// 🛡️ Blokace přiblížení
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
});

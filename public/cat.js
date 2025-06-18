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

// 🚀 Okamžité reakce pro mobil & desktop
cat.addEventListener('touchstart', handleClick, { passive: true });
cat.addEventListener('mousedown', handleClick);

function handleClick() {
  if (transitionDone) return;

  clickCount++;
  isTongue = !isTongue;
  cat.src = isTongue ? images.tongue.src : images.normal.src;

  // ❤️ Místo bubliny vystřelíme srdce
  if (clickCount < 10) {
    const heart = document.createElement('div');
    heart.className = 'meow-pop';
    heart.textContent = '❤️';
    heart.style.left = `${Math.random() * 100 - 50}px`;
    heart.style.top = `${Math.random() * -50 - 10}px`;
    catContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  }

  if (clickCount === 10) {
    transitionDone = true;
    cat.style.display = 'none';
    heartMsg.style.display = 'block';
    heartMsg.classList.add('grow');

    setTimeout(() => {
      heartMsg.classList.remove('grow');
      heartMsg.classList.add('explode');
    }, 1800);

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
    }, 3200);
  }
}

// 🛡️ Blokace pinch zoom a double-tapu
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
});

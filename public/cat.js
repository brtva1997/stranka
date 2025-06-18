const cat = document.getElementById('cat');
const catContainer = document.getElementById('cat-container');
const heartMsg = document.getElementById('heart-msg');
const app = document.getElementById('app');
const heartsContainer = document.getElementById('hearts-container');

let clickCount = 0;
let isTongue = false;
let transitionDone = false;

cat.addEventListener('click', () => {
  if (transitionDone) return;

  clickCount++;
  isTongue = !isTongue;
  cat.src = isTongue ? 'cat2.png' : 'cat.png';

  document.querySelectorAll('.meow-pop').forEach(b => b.remove());

  if (clickCount < 10) {
    const bubble = document.createElement('div');
    bubble.className = 'meow-pop';
    bubble.textContent = 'MŇAU!';
    bubble.style.left = `${Math.random() * 100 - 50}px`;
    bubble.style.top = `${Math.random() * -50 - 10}px`;
    catContainer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1000);
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
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.animationDuration = 6 + Math.random() * 4 + 's';
        heart.textContent = '❤';
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
      }, 400);
    }, 3200);
  }
});

// 🛡️ Blokace pinch/double-tap zoom na mobilech
document.addEventListener('touchstart', e => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', e => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
});

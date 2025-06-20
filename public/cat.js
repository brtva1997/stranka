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
    heartMsg.textContent = '💖';
    heartMsg.style.display = 'block';
    heartMsg.classList.add('big-heart');

    setTimeout(() => {
      heartMsg.style.display = 'none';
      app.classList.remove('hidden');

      document.querySelectorAll('.amount').forEach(cell => {
        const amount = Number(cell.dataset.amount || 0);
        cell.textContent = amount.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
      });

      const paidRows = [...document.querySelectorAll('tr.paid')];
      const unpaidRows = [...document.querySelectorAll('tr.unpaid')];
      const paidSum = paidRows.reduce((sum, row) => sum + Number(row.dataset.amount), 0);
      const unpaidSum = unpaidRows.reduce((sum, row) => sum + Number(row.dataset.amount), 0);

      document.getElementById('paidAmount').textContent = paidSum.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP'
      });
      document.getElementById('unpaidAmount').textContent = unpaidSum.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP'
      });

      setInterval(() => {
        const fallHeart = document.createElement('div');
        fallHeart.className = 'heart';
        fallHeart.style.left = Math.random() * 100 + '%';
        fallHeart.style.fontSize = Math.random() * 20 + 10 + 'px';
        fallHeart.style.animationDuration = 6 + Math.random() * 4 + 's';
        fallHeart.style.color = '#ffdde5';
        fallHeart.textContent = '❤';
        heartsContainer.appendChild(fallHeart);
        setTimeout(() => fallHeart.remove(), 10000);
      }, 400);
    }, 2000);
  }
}

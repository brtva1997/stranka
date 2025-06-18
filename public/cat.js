const cat = document.getElementById('cat');
const catContainer = document.getElementById('cat-container');
const heartMsg = document.getElementById('heart-msg');
const app = document.getElementById('app');
let clickCount = 0;
let isTongue = false;

cat.addEventListener('click', () => {
  clickCount++;
  isTongue = !isTongue;
  cat.src = isTongue ? 'cat2.png' : 'cat.png';

  const oldMeow = document.querySelector('.meow-pop');
  if (oldMeow) oldMeow.remove();

  if (clickCount < 10) {
    const bubble = document.createElement('div');
    bubble.className = 'meow-pop';
    bubble.textContent = 'MŇAU!';
    const offsetX = Math.random() * 100 - 50;
    const offsetY = Math.random() * -50 - 10;
    bubble.style.left = `${offsetX}px`;
    bubble.style.top = `${offsetY}px`;
    catContainer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1200);
  }

  if (clickCount === 10) {
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

      const paid = [...document.querySelectorAll('tr.paid')];
      const unpaid = [...document.querySelectorAll('tr.unpaid')];
      const paidSum = paid.reduce((sum, row) => sum + Number(row.dataset.amount), 0);
      const unpaidSum = unpaid.reduce((sum, row) => sum + Number(row.dataset.amount), 0);
      document.getElementById('paidAmount').textContent = paidSum.toLocaleString();
      document.getElementById('unpaidAmount').textContent = unpaidSum.toLocaleString();

      const hearts = document.getElementById('hearts-container');
      setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.animationDuration = 6 + Math.random() * 4 + 's';
        heart.textContent = '❤';
        hearts.appendChild(heart);
        setTimeout(() => hearts.removeChild(heart), 10000);
      }, 400);
    }, 3200);
  }
});

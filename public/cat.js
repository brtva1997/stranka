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

  // Odstranit předchozí MŇAU
  const oldMeow = document.querySelector('.meow-pop');
  if (oldMeow) oldMeow.remove();

  if (clickCount < 10) {
    const bubble = document.createElement('div');
    bubble.className = 'meow-pop';
    bubble.textContent = 'MŇAU!';
    bubble.style.left = `${Math.random() * 200 - 100}px`;
    bubble.style.top = `${Math.random() * -50 - 10}px`;
    catContainer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1200);
  }

  if (clickCount === 10) {
    cat.style.display = 'none';
    heartMsg.style.display = 'block';
    heartMsg.classList.add('grow');

    setTimeout(() => {
      heartMsg.style.display = 'none';
      app.classList.remove('hidden');
      sessionStorage.setItem('catClicked', 'true');

      // Výpočet částek
      const paid = [...document.querySelectorAll('tr.paid')];
      const unpaid = [...document.querySelectorAll('tr.unpaid')];
      const paidSum = paid.reduce((sum, row) => sum + Number(row.dataset.amount), 0);
      const unpaidSum = unpaid.reduce((sum, row) => sum + Number(row.dataset.amount), 0);

      document.getElementById('paidAmount').textContent =
        paidSum.toLocaleString();
      document.getElementById('unpaidAmount').textContent =
        unpaidSum.toLocaleString();
    }, 2000);
  }
});

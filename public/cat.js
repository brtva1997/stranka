let clickCount = 0;
let revertTimeout;

const cat = document.getElementById('cat');
const heartMsg = document.getElementById('heart-msg');
const app = document.getElementById('app');
const catContainer = document.getElementById('cat-container');
// 💳 Načtení a zobrazení splátek
function loadPayments() {
  fetch('payments.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('monthly-sections');
      let totalDebt = 3300;
      let paidTotal = 0;

      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Datum</th>
            <th>Status</th>
            <th>Částka</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(e => {
            const d = new Date(e.date).toLocaleDateString('cs-CZ');
            const isPaid = e.status === 'paid';
            const isNearest = e.status === 'nearest';

            if (isPaid) {
              paidTotal += e.amount;
              totalDebt -= e.amount;
            }

            const statusIcon = isPaid ? '✅' : isNearest ? '⌛' : '➖';
            const rowClass = isPaid
              ? 'paid'
              : isNearest
              ? 'nearest-highlight'
              : 'unpaid';

            return `
              <tr class="${rowClass}">
                <td>${d}</td>
                <td>${statusIcon}</td>
                <td>£80 nájem + £${e.amount} splátka</td>
              </tr>
                  `;
          }).join('')}
        </tbody>
      `;

      container.innerHTML = '';
      container.appendChild(table);

      document.getElementById('paidAmount').textContent = paidTotal.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP'
      });

      document.getElementById('unpaidAmount').textContent = totalDebt.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP'
      });
    });
}



// 💖 Padající pozadí
function spawnBackgroundHearts() {
  const container = document.getElementById('background-hearts');
  setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = ['💖', '💜', '🩷', '💕'][Math.floor(Math.random() * 4)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${4 + Math.random() * 3}s`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
  }, 400);
}

// 🐾 Klikání na kočku
// Počkáme na načtení všech klíčových obrázků
const preloadImages = ['cat.png', 'cat2.png'].map(src => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = resolve;
    img.src = src;
  });
});

Promise.all(preloadImages).then(() => {
  cat.style.display = 'block'; // nebo 'inline-block' dle layoutu
});


  cat.addEventListener('click', () => {
  clickCount++;

  if (clickCount < 10) {
    // 🔁 Přepnutí obrázku
    isCat2 = !isCat2;
    cat.src = isCat2 ? 'cat2.png' : 'cat.png';

    // 💖 Vystřelující srdíčko
    const rect = cat.getBoundingClientRect();
    const floatHeart = document.createElement('div');
    floatHeart.className = 'heart';

    const xOffset = (Math.random() - 0.5) * 120;
    const yOffset = (Math.random() - 1) * 80;

    floatHeart.style.left = `${rect.left + rect.width / 2 + xOffset}px`;
    floatHeart.style.top = `${rect.top + rect.height / 2 + yOffset}px`;
    floatHeart.style.fontSize = `${Math.random() * 1.2 + 0.8}rem`;
    floatHeart.textContent = ['💖', '💜', '🩷', '💕'][Math.floor(Math.random() * 4)];

    document.body.appendChild(floatHeart);
    setTimeout(() => floatHeart.remove(), 800);
  }

  if (clickCount === 10) {
    cat.style.display = 'none';
    heartMsg.textContent = '💖';
    heartMsg.style.color = '#ff78c4';
    heartMsg.style.textShadow = 'none';
    heartMsg.style.display = 'flex';
    heartMsg.style.animation = 'none';
    void heartMsg.offsetWidth;
    heartMsg.style.animation = 'inflateFade 1.8s ease-out';

    setTimeout(() => {
      catContainer.classList.add('hidden');
      heartMsg.style.display = 'none';
      app.classList.remove('hidden');
      loadPayments();
      spawnBackgroundHearts();
      app.scrollIntoView({ behavior: 'smooth' });
    }, 1800);
  }
});
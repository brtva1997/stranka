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
      let paidTotal = 0;
      let unpaidTotal = 0;

      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Datum</th>
            <th>Status</th>
            <th>Popis</th>
            <th>Částka</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(e => {
            const d = new Date(e.date).toLocaleDateString('cs-CZ');
            const statusIcon = e.status === 'paid' ? '✅' :
                               e.status === 'nearest' ? '⌛' : '❌';
            const cls = e.status === 'paid' ? 'paid' :
                        e.status === 'nearest' ? 'nearest-highlight' : 'unpaid';
            if (e.status === 'paid') paidTotal += e.amount;
            else unpaidTotal += e.amount;

            return `
              <tr class="${cls}">
                <td>${d}</td>
                <td>${statusIcon}</td>
                <td>£80 nájem + £${e.amount} splátka</td>
                <td>£${(80 + e.amount).toFixed(2)}</td>
              </tr>`;
          }).join('')}
        </tbody>
      `;

      container.innerHTML = ''; // vyčistíme kontejner
      container.appendChild(table);

      document.getElementById('paidAmount').textContent = paidTotal.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP'
      });

      document.getElementById('unpaidAmount').textContent = unpaidTotal.toLocaleString('en-GB', {
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

// 🐱 Klikání na kočku
cat.addEventListener('click', () => {
  clickCount++;

  if (clickCount <= 10) {
    cat.src = 'cat2.png';
    clearTimeout(revertTimeout);
    revertTimeout = setTimeout(() => {
      cat.src = 'cat.png';
    }, 600);

    const rect = cat.getBoundingClientRect();
    const floatHeart = document.createElement('div');
    floatHeart.className = 'heart';
    floatHeart.style.left = `${rect.left + rect.width / 2}px`;
    floatHeart.style.top = `${rect.top + rect.height / 2}px`;
    floatHeart.style.fontSize = `${Math.random() * 1.2 + 0.8}rem`;
    floatHeart.textContent = ['💖', '💜', '🩷', '💕'][Math.floor(Math.random() * 4)];
    floatHeart.style.transition = 'opacity 0.4s ease';
    document.body.appendChild(floatHeart);

    setTimeout(() => floatHeart.style.opacity = '0', 100);
    setTimeout(() => floatHeart.remove(), 500);
  }

  if (clickCount === 10) {
    cat.style.display = 'none';
    heartMsg.style.display = 'flex'; // ne "block", protože používáme flex
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

let clickCount = 0;
let revertTimeout;

const cat = document.getElementById('cat');
const heartMsg = document.getElementById('heart-msg');
const app = document.getElementById('app');

// 🧩 Funkce pro načtení splátek (volá se až po 10. kliknutí)
function loadPayments() {
  fetch('payments.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('monthly-sections');
      const months = {};
      let paidTotal = 0;
      let unpaidTotal = 0;

      data.forEach(entry => {
        const date = new Date(entry.date);
        const monthKey = date.toISOString().slice(0, 7);
        if (!months[monthKey]) months[monthKey] = [];
        months[monthKey].push(entry);
        if (entry.status === 'paid') paidTotal += entry.amount;
        else unpaidTotal += entry.amount;
      });

      Object.entries(months).forEach(([monthKey, entries]) => {
        const [y, m] = monthKey.split('-');
        const title = new Date(`${y}-${m}-01`).toLocaleDateString('cs-CZ', {
          month: 'long',
          year: 'numeric'
        });

        const section = document.createElement('details');
        section.setAttribute('open', ''); // vždy otevřené – výška se nemění

        section.innerHTML = `
          <summary>${title}</summary>
          <table>
            <thead>
              <tr><th>Datum</th><th>Status</th><th>Částka</th></tr>
            </thead>
            <tbody>
              ${entries.map(e => {
                const d = new Date(e.date).toLocaleDateString('cs-CZ');
                const status = e.status === 'paid' ? '✅' :
                               e.status === 'nearest' ? '⌛' : '';
                const cls = e.status === 'paid' ? 'paid' :
                            e.status === 'nearest' ? 'nearest-highlight' : 'unpaid';
                return `
                  <tr class="${cls}">
                    <td>${d}</td>
                    <td>${status}</td>
                    <td>£125<br /><small>(£80 nájem + £${e.amount} splátka)</small></td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>`;
        container.appendChild(section);
      });

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

// 🐱 Klikání na kočku a efekty
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
    heartMsg.style.display = 'block';
    heartMsg.style.animation = 'inflateFade 1.8s ease-out';

    setTimeout(() => {
      heartMsg.style.display = 'none';
      app.classList.remove('hidden');
      loadPayments(); // 💾 načtení přehledu až teď
      app.scrollIntoView({ behavior: 'smooth' });
    }, 1800);
  }
});

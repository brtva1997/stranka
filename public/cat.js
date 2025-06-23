let clickCount = 0;
let revertTimeout;

const cat = document.getElementById('cat');
const heartMsg = document.getElementById('heart-msg');
const app = document.getElementById('app');

// Kliknutí na kočku
cat.addEventListener('click', () => {
  clickCount++;
  console.log('Kliknutí:', clickCount);

  if (clickCount <= 10) {
    // Přepnout obrázek
    cat.src = 'cat2.png';
    clearTimeout(revertTimeout);
    revertTimeout = setTimeout(() => {
      cat.src = 'cat.png';
    }, 600);

    // Pozice kočky na stránce
    const rect = cat.getBoundingClientRect();
    const floatHeart = document.createElement('div');
    floatHeart.className = 'heart';
    floatHeart.style.position = 'fixed';
    floatHeart.style.left = `${rect.left + rect.width / 2 + (Math.random() * 60 - 30)}px`;
    floatHeart.style.top = `${rect.top + rect.height / 2 + (Math.random() * 40 - 20)}px`;
    floatHeart.style.fontSize = `${Math.random() * 1.4 + 0.6}rem`;
    floatHeart.textContent = ['💖', '💜', '🩷', '💕'][clickCount % 4];
    document.body.appendChild(floatHeart);
    setTimeout(() => floatHeart.remove(), 6000);
  }

  if (clickCount === 10) {
    console.log('Zobrazuji app...');
    cat.style.display = 'none';
    heartMsg.style.display = 'block';
    heartMsg.style.animation = 'inflateFade 1.8s ease-out';

    setTimeout(() => {
      heartMsg.style.display = 'none';
      heartMsg.style.animation = '';
      app.classList.remove('hidden');
      app.scrollIntoView({ behavior: 'smooth' });
    }, 1800);
  }
});

// Načtení dat ze splátkového JSONu
fetch('payments.json')
  .then(res => {
    if (!res.ok) throw new Error('Chyba při načítání payments.json');
    return res.json();
  })
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
      section.innerHTML = `
        <summary>${title}</summary>
        <table>
          <thead>
            <tr><th>Datum</th><th>Popis</th><th>Status</th><th>Částka</th></tr>
          </thead>
          <tbody>
            ${entries.map(e => {
              const d = new Date(e.date).toLocaleDateString('cs-CZ');
              const status = e.status === 'paid' ? '✅' :
                             e.status === 'nearest' ? '⌛' : '';
              const cls = e.status === 'paid' ? 'paid' :
                          e.status === 'nearest' ? 'nearest-highlight' : 'unpaid';
              return `
                <tr class="${cls}" data-amount="${e.amount}">
                  <td>${d}</td>
                  <td>${e.label}</td>
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
  })
  .catch(err => console.error('❌ Nepodařilo se načíst payments.json:', err));

// Načítání splátek z payments.json a rozdělení podle měsíců
fetch('payments.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('monthly-sections');
    const months = {};

    let paidTotal = 0;
    let unpaidTotal = 0;

    data.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = date.toISOString().slice(0, 7); // např. "2025-06"
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
              const statusSymbol = e.status === 'paid' ? '✅' :
                                   e.status === 'nearest' ? '⌛' : '';
              const rowClass = e.status === 'paid' ? 'paid' :
                               e.status === 'nearest' ? 'nearest-highlight' : 'unpaid';

              return `
                <tr class="${rowClass}" data-amount="${e.amount}">
                  <td>${d}</td>
                  <td>${e.label}</td>
                  <td>${statusSymbol}</td>
                  <td>
                    £125<br />
                    <small>(£80 nájem + £${e.amount} splátka)</small>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
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

// Klikací animace na kočku: velké srdce, srdíčka a text
const cat = document.getElementById('cat');
const heartMsg = document.getElementById('heart-msg');
const heartsContainer = document.getElementById('hearts-container');

cat.addEventListener('click', () => {
  // 💖 Velké srdce
  heartMsg.style.display = 'block';
  heartMsg.style.animation = 'inflateFade 1.1s ease-out';

  setTimeout(() => {
    heartMsg.style.display = 'none';
    heartMsg.style.animation = '';
  }, 1100);

  // 💬 Text "Meow!" u kočky
  const meow = document.createElement('div');
  meow.className = 'meow-pop';
  meow.style.left = `${cat.offsetLeft + 80}px`;
  meow.style.top = `${cat.offsetTop - 20}px`;
  meow.textContent = 'Meow!';
  document.body.appendChild(meow);
  setTimeout(() => meow.remove(), 800);

  // 🫧 Plovoucí srdíčka
  for (let i = 0; i < 4; i++) {
    const floatHeart = document.createElement('div');
    floatHeart.className = 'heart';
    floatHeart.style.left = `${Math.random() * 90 + 5}%`;
    floatHeart.style.fontSize = `${Math.random() * 1.4 + 0.6}rem`;
    floatHeart.textContent = ['💖','💜','🩷','💕'][i % 4];
    heartsContainer.appendChild(floatHeart);
    setTimeout(() => floatHeart.remove(), 8000);
  }
});

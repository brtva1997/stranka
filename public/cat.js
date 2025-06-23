let clickCount = 0;
let revertTimeout;

const cat = document.getElementById('cat');
const heartMsg = document.getElementById('heart-msg');
const app = document.getElementById('app');

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
    floatHeart.style.left = `${rect.left + rect.width / 2 + (Math.random() * 60 - 30)}px`;
    floatHeart.style.top = `${rect.top + rect.height / 2 + (Math.random() * 40 - 20)}px`;
    floatHeart.textContent = ['💖', '💜', '🩷', '💕'][clickCount % 4];
    floatHeart.style.transition = 'opacity 0.6s ease';
    document.body.appendChild(floatHeart);

    setTimeout(() => floatHeart.style.opacity = '0', 5000);
    setTimeout(() => floatHeart.remove(), 5800);

    floatHeart.addEventListener('click', () => {
      floatHeart.style.opacity = '0';
      setTimeout(() => floatHeart.remove(), 500);
    });
  }

  if (clickCount === 10) {
    cat.style.display = 'none';
    heartMsg.style.display = 'block';
    heartMsg.style.animation = 'inflateFade 1.8s ease-out';

    setTimeout(() => {
      heartMsg.style.display = 'none';
      app.classList.remove('hidden');
      app.scrollIntoView({ behavior: 'smooth' });
    }, 1800);
  }
});

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

      const hasNearest = entries.some(e => e.status === 'nearest');
      const section = document.createElement('details');
      if (hasNearest) section.setAttribute('open', '');
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
                <tr class="${cls}">
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
  });

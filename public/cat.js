let clickCount = 0;
let revertTimeout;

const cat = document.getElementById('cat');
const heartMsg = document.getElementById('heart-msg');
const heartsContainer = document.getElementById('hearts-container');
const app = document.getElementById('app');

cat.addEventListener('click', () => {
  clickCount++;

  // Obrázek: přepnout a vrátit
  cat.src = 'cat2.png';
  clearTimeout(revertTimeout);
  revertTimeout = setTimeout(() => {
    cat.src = 'cat.png';
  }, 600);

  // Vytvoření srdíčka v okolí kočky
  const floatHeart = document.createElement('div');
  floatHeart.className = 'heart';
  const rect = cat.getBoundingClientRect();
  floatHeart.style.position = 'fixed';
  floatHeart.style.left = `${rect.left + rect.width / 2 + (Math.random() * 60 - 30)}px`;
  floatHeart.style.top = `${rect.top + rect.height / 2 + (Math.random() * 40 - 20)}px`;
  floatHeart.style.fontSize = `${Math.random() * 1.4 + 0.6}rem`;
  floatHeart.textContent = ['💖', '💜', '🩷', '💕'][clickCount % 4];
  document.body.appendChild(floatHeart);
  setTimeout(() => floatHeart.remove(), 6000);

  // Po 10. kliknutí: skrýt kočku → velké srdce → splátky
  if (clickCount === 10) {
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

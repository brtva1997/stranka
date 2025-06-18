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

  // Vygeneruj 1–3 bubliny MŇAU
  if (clickCount < 10) {
    const meowCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < meowCount; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'meow-pop';
      bubble.textContent = 'MŇAU!';
      bubble.style.top = (40 + Math.random() * 100) + 'px';
      bubble.style.left = (cat.offsetLeft + 100 + Math.random() * 60 - 30) + 'px';
      catContainer.appendChild(bubble);
      setTimeout(() => bubble.remove(), 1500);
    }
  }

  if (clickCount === 10) {
    cat.style.display = 'none';
    heartMsg.style.display = 'block';
    setTimeout(() => {
      heartMsg.style.display = 'none';
      app.classList.remove('hidden');
      sessionStorage.setItem('catClicked', 'true');
    }, 2000);
  }
});

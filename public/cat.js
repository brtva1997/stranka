const cat = document.getElementById('cat');
const meow = document.getElementById('meow');
let clickCount = 0;

cat.addEventListener('click', () => {
  clickCount++;

  // Přepínání výrazů
  const isEven = clickCount % 2 === 0;
  cat.src = isEven ? 'cat2.png' : 'cat.png';

  // Jemná animace
  cat.style.transform = 'scale(1.08)';
  setTimeout(() => cat.style.transform = 'rotate(0deg)', 250);

  // Po šestém kliknutí: MŇAU + redirect
  if (clickCount === 6) {
    meow.classList.add('visible');
    sessionStorage.setItem('catClicked', 'true');
    setTimeout(() => window.location.href = 'app.html', 1200);
  }
});

// Reset stavu po návratu
window.addEventListener('pageshow', () => {
  clickCount = 0;
  cat.src = 'cat.png';
  meow.classList.remove('visible');
});

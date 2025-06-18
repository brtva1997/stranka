const cat = document.getElementById('cat');
const meow = document.getElementById('meow');
let clickCount = 0;
let isTongue = false;

cat.addEventListener('click', () => {
  clickCount++;

  // Střídání obrázku kočičky
  isTongue = !isTongue;
  cat.src = isTongue ? 'cat2.png' : 'cat.png';

  // Animace
  cat.style.transform = 'scale(1.08)';
  setTimeout(() => cat.style.transform = 'rotate(0deg)', 250);

  if (clickCount === 3) {
    meow.classList.add('visible');
    sessionStorage.setItem('catClicked', 'true');
    setTimeout(() => window.location.href = 'app.html', 1200);
  }
});

// Reset po návratu zpět nebo reloadu
window.addEventListener('pageshow', () => {
  clickCount = 0;
  isTongue = false;
  cat.src = 'cat.png';
  meow.classList.remove('visible');
});

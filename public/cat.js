const cat = document.getElementById('cat');
const meow = document.getElementById('meow');
let clickCount = 0;

cat.addEventListener('click', () => {
  clickCount++;

  if (clickCount === 1) {
    cat.style.transform = 'rotate(-2deg)';
    setTimeout(() => cat.style.transform = 'rotate(0deg)', 300);
  }

  if (clickCount === 2) {
    cat.src = 'cat2.png'; // přepneme na jazyk
    meow.classList.add('visible');
    setTimeout(() => meow.classList.remove('visible'), 1200);
  }

  if (clickCount === 3) {
    localStorage.setItem('catClicked', 'true');
    setTimeout(() => window.location.href = 'app.html', 1000);
  }
});

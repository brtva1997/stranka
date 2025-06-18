const cat = document.getElementById('cat');
let clickCount = 0;

cat.addEventListener('click', () => {
  clickCount++;
  if (clickCount === 1) {
    cat.classList.add('lick');
    setTimeout(() => cat.classList.remove('lick'), 1200);
  } else if (clickCount === 2) {
    cat.src = 'cat2.png';
    cat.classList.add('smile');
    localStorage.setItem('catClicked', 'true');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  }
});

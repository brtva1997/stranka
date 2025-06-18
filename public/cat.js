const cat = document.getElementById('cat');
const bubble = document.getElementById('bubble');
const heartMsg = document.getElementById('heart-msg');
let clickCount = 0;
let isTongue = false;

cat.addEventListener('click', () => {
  clickCount++;
  isTongue = !isTongue;
  cat.src = isTongue ? 'cat2.png' : 'cat.png';

  cat.style.transform = 'scale(1.08)';
  setTimeout(() => cat.style.transform = 'scale(1)', 250);

  if (clickCount === 10) {
    cat.style.display = 'none';
    heartMsg.style.display = 'block';
    sessionStorage.setItem('catClicked', 'true');
    setTimeout(() => window.location.href = 'app.html', 1500);
  } else {
    bubble.classList.add('visible');
    setTimeout(() => bubble.classList.remove('visible'), 800);
  }
});

window.addEventListener('pageshow', () => {
  clickCount = 0;
  isTongue = false;
  cat.src = 'cat.png';
  cat.style.display = 'block';
  heartMsg.style.display = 'none';
});

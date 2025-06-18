async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.role) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('table').style.display = '';
    loadPayments(data.role);
  } else {
    alert('Neplatné přihlášení');
  }
}

async function loadPayments(role) {
  const res = await fetch('/payments');
  const data = await res.json();
  const body = document.getElementById('payments-body');
  body.innerHTML = '';

  const today = new Date();
  let nearestIndex = -1;
  let minDiff = Infinity;

  data.payments.forEach((payment, index) => {
    const paymentDate = new Date(payment.date);
    if (!payment.paid && paymentDate >= today) {
      const diff = paymentDate - today;
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = index;
      }
    }
  });

  let total = 0;
  let paid = 0;

  data.payments.forEach((payment, index) => {
    const row = document.createElement('tr');

    if (index === nearestIndex && nearestIndex !== -1) {
      row.classList.add('nearest-highlight');
    }
    if (payment.paid) {
      row.classList.add('paid');
    }

    const dateCell = document.createElement('td');
    dateCell.textContent = payment.date;

    const amountCell = document.createElement('td');
    amountCell.textContent = payment.amount;
    if (role === 'admin') amountCell.contentEditable = true;

    const paidCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = payment.paid;
    checkbox.disabled = role !== 'admin';
    paidCell.appendChild(checkbox);

    // fajfka ✅ vedle checkboxu
    if (payment.paid) {
      const tick = document.createElement('span');
      tick.textContent = ' ✅';
      paidCell.appendChild(tick);
    }

    if (role === 'admin') {
      amountCell.addEventListener('blur', () => {
        const newAmount = parseFloat(amountCell.textContent) || 0;
        updatePayment(index, newAmount, checkbox.checked);
      });
      checkbox.addEventListener('change', () => {
        const newAmount = parseFloat(amountCell.textContent) || 0;
        updatePayment(index, newAmount, checkbox.checked);
      });
    }

    row.appendChild(dateCell);
    row.appendChild(amountCell);
    row.appendChild(paidCell);
    body.appendChild(row);

    total += payment.amount;
    if (payment.paid) paid += payment.amount;
  });

  document.getElementById('total-amount').textContent = total;
  document.getElementById('paid-amount').textContent = paid;
}

async function updatePayment(index, amount, paid) {
  const row = document.querySelectorAll('#payments-body tr')[index];

  const res = await fetch('/payments/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index, amount, paid })
  });

  const result = await res.json();
  if (result.success) {
    // Vizuální odezva
    row.style.transition = 'background-color 0.5s ease';
    row.style.backgroundColor = '#2e7d32';
    setTimeout(() => {
      row.style.backgroundColor = '';
    }, 800);

    // Dynamický styling
    row.classList.toggle('paid', paid);

    // Fajfka ✅ ve sloupci
    const paidCell = row.children[2];
    if (paid) {
      if (!paidCell.textContent.includes('✅')) {
        paidCell.innerHTML += ' ✅';
      }
    } else {
      paidCell.innerHTML = '';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false;
      checkbox.addEventListener('change', () => {
        const newAmount = parseFloat(row.children[1].textContent) || 0;
        updatePayment(index, newAmount, checkbox.checked);
      });
      paidCell.appendChild(checkbox);
    }

    // Přepočet souhrnu
    recalculateSummary();
  }
}

function recalculateSummary() {
  const rows = document.querySelectorAll('#payments-body tr');
  let total = 0;
  let paid = 0;

  rows.forEach(row => {
    const amount = parseFloat(row.children[1].textContent) || 0;
    const checked = row.querySelector('input[type=checkbox]')?.checked;
    total += amount;
    if (checked) paid += amount;
  });

  document.getElementById('total-amount').textContent = total;
  document.getElementById('paid-amount').textContent = paid;
}

function logout() {
  document.getElementById('login').style.display = '';
  document.getElementById('table').style.display = 'none';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

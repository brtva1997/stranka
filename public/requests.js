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

  // Najdi nejbližší budoucí nesplacenou splátku
  data.payments.forEach((payment, index) => {
    const paymentDate = new Date(payment.date);
    if (paymentDate >= today && !payment.paid) {
      const diff = paymentDate - today;
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = index;
      }
    }
  });

  data.payments.forEach((payment, index) => {
    const row = document.createElement('tr');

    if (index === nearestIndex) {
      row.classList.add('nearest-highlight');
    }

    const dateCell = document.createElement('td');
    dateCell.textContent = payment.date;

    const amountCell = document.createElement('td');
    amountCell.textContent = payment.amount;
    if (role === 'admin') amountCell.contentEditable = true;

    const paidCell = document.createElement('td');
    paidCell.innerHTML = `<input type="checkbox" ${payment.paid ? 'checked' : ''}>`;
    paidCell.querySelector('input').disabled = role !== 'admin';

    if (role === 'admin') {
      amountCell.addEventListener('blur', () => {
        updatePayment(index, +amountCell.textContent, payment.paid);
      });
      paidCell.querySelector('input').addEventListener('change', () => {
        updatePayment(index, +amountCell.textContent, paidCell.querySelector('input').checked);
      });
    }

    row.appendChild(dateCell);
    row.appendChild(amountCell);
    row.appendChild(paidCell);
    body.appendChild(row);
  });
}

async function updatePayment(index, amount, paid) {
  await fetch('/payments/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index, amount, paid })
  });
}

function logout() {
  document.getElementById('login').style.display = '';
  document.getElementById('table').style.display = 'none';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

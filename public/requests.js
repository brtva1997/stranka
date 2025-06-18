async function loadPayments() {
  const res = await fetch('/payments');
  const data = await res.json();
  const body = document.getElementById('payments-body');
  body.innerHTML = '';

  let total = 0;
  let paid = 0;

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

  data.payments.forEach((payment, index) => {
    const row = document.createElement('tr');

    row.classList.add(payment.paid ? 'paid' : 'unpaid');
    if (index === nearestIndex) {
      row.classList.add('nearest-highlight');
    }

    const dateCell = document.createElement('td');
    dateCell.textContent = payment.date;

    const amountCell = document.createElement('td');
    amountCell.textContent = payment.amount;

    const paidCell = document.createElement('td');
    paidCell.textContent = ''; // ikony přes CSS ::after

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

window.onload = loadPayments;

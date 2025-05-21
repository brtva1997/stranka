// Generování HTML tabulky pro dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
  const user = req.session.user;
  let tableRows = '';
  let totalPaid = 0;

  payments.forEach(payment => {
    const isPaid = payment.paid ? 'checked' : '';
    totalPaid += payment.paid ? payment.amount : 0;

    tableRows += `
      <tr>
        <td>${payment.dueDate}</td>
        <td>£${payment.amount}</td>
        <td>
          ${user.role === 'admin' ? `
            <input type="checkbox" name="paid_${payment.id}" ${isPaid}>
          ` : `
            ${payment.paid ? 'Zaplaceno' : 'Nezaplaceno'}
          `}
        </td>
      </tr>
    `;
  });

  const formStart = user.role === 'admin' ? '<form method="POST" action="/update-payments">' : '';
  const formEnd = user.role === 'admin' ? '<button type="submit" class="submit-btn">Uložit změny</button></form>' : '';

  res.send(`
    <!DOCTYPE html>
    <html lang="cs">
    <head>
      <meta charset="UTF-8">
      <title>Splátkový kalendář</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <h2>Vítej, ${user.username}</h2>
      <p>Celkem splaceno: £${totalPaid}</p>
      ${formStart}
      <table>
        <tr>
          <th>Datum splatnosti</th>
          <th>Částka</th>
          <th>Status</th>
        </tr>
        ${tableRows}
      </table>
      ${formEnd}
    </body>
    </html>
  `);
});

// Profit calculation logic
function calculateProfit() {
  const totalSales = document.getElementById('total-sales').value;
  const totalCost = document.getElementById('total-cost').value;
  const otherExpenses = document.getElementById('other-expenses').value;

  if (!totalSales || !totalCost || !otherExpenses) {
    document.getElementById('result').innerHTML = 'Please fill in all fields.';
    return;
  }

  const profit = totalSales - totalCost - otherExpenses;
  document.getElementById(
    'result'
  ).innerHTML = `Your restaurant's profit is: £${profit}`;
}

// Lead capture form submission
document.getElementById('leadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  if (!name || !email) {
    document.getElementById('form-message').innerHTML =
      'Please fill in all required fields.';
    return;
  }

  // Show success message (In real-world application, you would send the form data to a server)
  document.getElementById('form-message').innerHTML =
    "Thank you! We'll get back to you soon.";

  // Reset form fields
  document.getElementById('leadForm').reset();
});

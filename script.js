let profitChart = null;

// Profit calculation logic
function calculateProfit() {
  const totalSales = parseFloat(document.getElementById('total-sales').value) || 0;
  const totalCost = parseFloat(document.getElementById('total-cost').value) || 0;
  const otherExpenses = parseFloat(document.getElementById('other-expenses').value) || 0;

  const resultContainer = document.getElementById('result');
  
  if (!totalSales || !totalCost || !otherExpenses) {
    resultContainer.innerHTML = 'Please fill in all fields.';
    resultContainer.className = 'result-container';
    updateGauge(0, 0);
    updateChart(0, 0, 0, 0);
    return;
  }

  const profit = totalSales - totalCost - otherExpenses;
  const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;
  
  let resultClass = 'result-container ';
  let icon = '';
  let message = '';
  
  if (profit > 0) {
    resultClass += 'result-profit';
    icon = '<i class="fas fa-arrow-up"></i>';
    message = `${icon} Profit: £${profit.toFixed(2)} (${profitMargin.toFixed(1)}% margin)`;
  } else if (profit < 0) {
    resultClass += 'result-loss';
    icon = '<i class="fas fa-arrow-down"></i>';
    message = `${icon} Loss: £${Math.abs(profit).toFixed(2)} (${profitMargin.toFixed(1)}% margin)`;
  } else {
    resultClass += 'result-neutral';
    icon = '<i class="fas fa-minus"></i>';
    message = `${icon} Break Even: £0.00`;
  }
  
  resultContainer.className = resultClass;
  resultContainer.innerHTML = message;
  
  updateGauge(profit, totalSales);
  updateChart(totalSales, totalCost, otherExpenses, profit);
}

function setupRealTimeUpdates() {
  const inputs = ['total-sales', 'total-cost', 'other-expenses'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', calculateProfit);
  });
}

function updateGauge(profit, totalSales) {
  const gauge = document.getElementById('profit-gauge');
  const gaugeText = document.getElementById('gauge-text');
  
  if (totalSales === 0) {
    gauge.style.width = '0%';
    gauge.style.background = '#e9ecef';
    gaugeText.textContent = 'Enter values to see profit margin';
    return;
  }
  
  const profitMargin = (profit / totalSales) * 100;
  const clampedMargin = Math.max(-100, Math.min(100, profitMargin));
  const gaugeWidth = Math.abs(clampedMargin);
  
  gauge.style.width = `${gaugeWidth}%`;
  
  if (profit > 0) {
    gauge.style.background = 'linear-gradient(90deg, #28a745, #20c997)';
    gaugeText.textContent = `Profit Margin: ${profitMargin.toFixed(1)}%`;
  } else if (profit < 0) {
    gauge.style.background = 'linear-gradient(90deg, #dc3545, #e74c3c)';
    gaugeText.textContent = `Loss Margin: ${Math.abs(profitMargin).toFixed(1)}%`;
  } else {
    gauge.style.background = '#6c757d';
    gaugeText.textContent = 'Break Even Point';
  }
}

function updateChart(sales, costs, expenses, profit) {
  const ctx = document.getElementById('profitChart').getContext('2d');
  
  if (profitChart) {
    profitChart.destroy();
  }
  
  const data = {
    labels: ['Total Sales', 'Food & Labor', 'Other Expenses', 'Profit/Loss'],
    datasets: [{
      data: [sales, costs, expenses, Math.abs(profit)],
      backgroundColor: [
        '#007bff',
        '#fd7e14',
        '#6f42c1',
        profit >= 0 ? '#28a745' : '#dc3545'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };
  
  profitChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const icon = themeToggle.querySelector('i');
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(icon, savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(icon, newTheme);
  });
}

function updateThemeIcon(icon, theme) {
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Lead capture form submission
document.getElementById('leadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const formMessage = document.getElementById('form-message');

  if (!name || !email) {
    formMessage.innerHTML = 'Please fill in all required fields.';
    formMessage.className = 'form-error';
    return;
  }

  // Show success message (In real-world application, you would send the form data to a server)
  formMessage.innerHTML = "Thank you! We'll get back to you soon with your detailed report.";
  formMessage.className = 'form-success';

  // Reset form fields
  document.getElementById('leadForm').reset();
});

document.addEventListener('DOMContentLoaded', function() {
  setupRealTimeUpdates();
  initThemeToggle();
  
  updateChart(0, 0, 0, 0);
});

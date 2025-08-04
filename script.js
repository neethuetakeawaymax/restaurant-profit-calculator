let profitChart = null;

function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');
  const currentTheme = body.getAttribute('data-theme');
  
  if (currentTheme === 'dark') {
    body.removeAttribute('data-theme');
    themeIcon.className = 'fas fa-moon';
    localStorage.setItem('theme', 'light');
  } else {
    body.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fas fa-sun';
    localStorage.setItem('theme', 'dark');
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const themeIcon = document.getElementById('theme-icon');
  
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fas fa-sun';
  }
}

function calculateProfitRealTime() {
  const indicator = document.getElementById('realTimeIndicator');
  indicator.classList.add('active');
  
  setTimeout(() => {
    calculateProfit();
    indicator.classList.remove('active');
  }, 300);
}

// Enhanced profit calculation logic
function calculateProfit() {
  const totalSales = parseFloat(document.getElementById('total-sales').value) || 0;
  const totalCost = parseFloat(document.getElementById('total-cost').value) || 0;
  const otherExpenses = parseFloat(document.getElementById('other-expenses').value) || 0;
  const resultElement = document.getElementById('result');
  const progressFill = document.getElementById('progressFill');
  const chartContainer = document.getElementById('chartContainer');

  if (!totalSales && !totalCost && !otherExpenses) {
    resultElement.innerHTML = 'Enter values to see your profit calculation';
    resultElement.className = 'neutral';
    progressFill.style.width = '0%';
    chartContainer.classList.remove('show');
    return;
  }

  if (!totalSales || !totalCost || !otherExpenses) {
    resultElement.innerHTML = 'Please fill in all fields for accurate calculation.';
    resultElement.className = 'neutral';
    return;
  }

  const profit = totalSales - totalCost - otherExpenses;
  const profitMargin = totalSales > 0 ? ((profit / totalSales) * 100).toFixed(1) : 0;
  
  const progressPercentage = Math.min(Math.max((profitMargin + 50) / 100 * 100, 0), 100);
  progressFill.style.width = progressPercentage + '%';
  
  let resultClass, icon, message;
  if (profit > 0) {
    resultClass = 'profit';
    icon = 'fas fa-arrow-trend-up';
    message = `Excellent! Your restaurant's profit is £${profit.toLocaleString()} (${profitMargin}% margin)`;
  } else if (profit < 0) {
    resultClass = 'loss';
    icon = 'fas fa-arrow-trend-down';
    message = `Loss of £${Math.abs(profit).toLocaleString()} (${profitMargin}% margin)`;
  } else {
    resultClass = 'neutral';
    icon = 'fas fa-equals';
    message = `Break-even point reached (${profitMargin}% margin)`;
  }
  
  resultElement.className = resultClass;
  resultElement.innerHTML = `
    <div class="profit-indicator">
      <i class="${icon}"></i>
      ${message}
    </div>
  `;
  
  updateProfitChart(totalSales, totalCost, otherExpenses, profit);
  chartContainer.classList.add('show');
}

function updateProfitChart(sales, costs, expenses, profit) {
  const ctx = document.getElementById('profitChart').getContext('2d');
  
  if (profitChart) {
    profitChart.destroy();
  }
  
  const data = {
    labels: ['Revenue', 'Food Costs', 'Other Expenses', 'Profit'],
    datasets: [{
      data: [sales, costs, expenses, Math.max(profit, 0)],
      backgroundColor: [
        'rgba(41, 128, 185, 0.8)',
        'rgba(230, 126, 34, 0.8)', 
        'rgba(142, 68, 173, 0.8)',
        profit >= 0 ? 'rgba(39, 174, 96, 0.8)' : 'rgba(231, 76, 60, 0.8)'
      ],
      borderColor: [
        'rgba(41, 128, 185, 1)',
        'rgba(230, 126, 34, 1)',
        'rgba(142, 68, 173, 1)', 
        profit >= 0 ? 'rgba(39, 174, 96, 1)' : 'rgba(231, 76, 60, 1)'
      ],
      borderWidth: 2
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
            usePointStyle: true,
            font: {
              family: 'Poppins',
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: £${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        duration: 1000
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  
  const inputs = ['total-sales', 'total-cost', 'other-expenses'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    let timeout;
    
    input.addEventListener('input', function() {
      clearTimeout(timeout);
      timeout = setTimeout(calculateProfitRealTime, 500);
    });
  });
  
  calculateProfit();
});

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

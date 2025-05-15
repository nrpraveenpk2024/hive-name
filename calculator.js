document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Average Calculator Form
    const averageForm = document.getElementById('averageCalculatorForm');
    averageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const hiveCount = parseFloat(document.getElementById('hiveCount').value);
        const timePeriod = parseFloat(document.getElementById('timePeriod').value);
        const totalHoney = parseFloat(document.getElementById('totalHoney').value);
        
        if (hiveCount <= 0 || timePeriod <= 0) {
            alert('Please enter valid numbers greater than 0');
            return;
        }
        
        const avgPerHive = totalHoney / hiveCount / timePeriod;
        const avgPerPeriod = totalHoney / hiveCount;
        
        document.getElementById('avgPerHive').textContent = avgPerHive.toFixed(2) + ' kg';
        document.getElementById('avgPerPeriod').textContent = avgPerPeriod.toFixed(2) + ' kg';
        document.getElementById('totalProduction').textContent = totalHoney.toFixed(2) + ' kg';
    });
    
    // Profit Calculator Form
    const profitForm = document.getElementById('profitCalculatorForm');
    profitForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const honeyAmount = parseFloat(document.getElementById('honeyAmount').value);
        const pricePerKg = parseFloat(document.getElementById('pricePerKg').value);
        const productionCost = parseFloat(document.getElementById('productionCost').value);
        
        const grossRevenue = honeyAmount * pricePerKg;
        const netProfit = grossRevenue - productionCost;
        const profitMargin = productionCost > 0 ? (netProfit / grossRevenue) * 100 : 100;
        
        document.getElementById('grossRevenue').textContent = '$' + grossRevenue.toFixed(2);
        document.getElementById('netProfit').textContent = '$' + netProfit.toFixed(2);
        document.getElementById('profitMargin').textContent = profitMargin.toFixed(1) + '%';
    });
    
    // Yield Predictor Form
    const yieldForm = document.getElementById('yieldCalculatorForm');
    const yieldChartCtx = document.getElementById('yieldChart').getContext('2d');
    let yieldChart = null;
    
    yieldForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentYield = parseFloat(document.getElementById('currentYield').value);
        const hiveCountPredict = parseFloat(document.getElementById('hiveCountPredict').value);
        const weeksToPredict = parseInt(document.getElementById('weeksToPredict').value);
        const growthRate = parseFloat(document.getElementById('growthRate').value) / 100;
        
        if (currentYield < 0 || hiveCountPredict <= 0 || weeksToPredict <= 0) {
            alert('Please enter valid numbers');
            return;
        }
        
        // Calculate predicted weekly yield per hive
        const predictedWeekly = currentYield * Math.pow(1 + growthRate, weeksToPredict - 1);
        
        // Calculate total predicted yield for all hives
        let totalPredicted = 0;
        const weeklyData = [];
        
        for (let week = 1; week <= weeksToPredict; week++) {
            const weeklyYield = currentYield * Math.pow(1 + growthRate, week - 1);
            weeklyData.push(weeklyYield);
            totalPredicted += weeklyYield * hiveCountPredict;
        }
        
        document.getElementById('predictedWeekly').textContent = predictedWeekly.toFixed(2) + ' kg';
        document.getElementById('totalPredicted').textContent = totalPredicted.toFixed(2) + ' kg';
        
        // Update or create the chart
        updateYieldChart(weeklyData, weeksToPredict);
    });
    
    function updateYieldChart(weeklyData, weeksToPredict) {
        const labels = [];
        for (let i = 1; i <= weeksToPredict; i++) {
            labels.push(`Week ${i}`);
        }
        
        if (yieldChart) {
            yieldChart.data.labels = labels;
            yieldChart.data.datasets[0].data = weeklyData;
            yieldChart.update();
        } else {
            yieldChart = new Chart(yieldChartCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Predicted Honey Yield (kg/hive)',
                        data: weeklyData,
                        borderColor: '#FFC107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y.toFixed(2) + ' kg/hive';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Kilograms per Hive'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Week'
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Initialize the first tab as active
    document.querySelector('.tab-btn').click();
});
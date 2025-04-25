document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const paymentForm = document.getElementById('dollarPaymentForm');
    const amountUSD = document.getElementById('amountUSD');
    const amountDOP = document.getElementById('amountDOP');
    const exchangeRateElement = document.getElementById('exchangeRate');
    const exchangeRateTimeElement = document.getElementById('exchangeRateTime');
    const interestRateElement = document.getElementById('currentInterestRate');
    const paymentHistory = document.getElementById('paymentHistory');
    
    let confirmationModal;
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
        confirmationModal = new bootstrap.Modal(modalElement);
    }

    let currentExchangeRate = 56.50;
    let currentInterestRate = 6.50;
    
    const samplePayments = [
        { date: '15/06/2023', destination: 'Visa Platinum', amount: 150.00, status: 'Completado' },
        { date: '10/06/2023', destination: 'Amazon Prime', amount: 12.99, status: 'Completado' },
        { date: '01/06/2023', destination: 'Netflix', amount: 10.99, status: 'Completado' }
    ];

    async function fetchExchangeRate() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            return data.rates.DOP || 56.50;
        } catch (error) {
            console.log('Using default exchange rate');
            return 56.50;
        }
    }

    function getDominicanInterestRate() {
        const variation = (Math.random() * 0.3 - 0.15);
        return Math.max(6.0, Math.min(7.0, currentInterestRate + variation));
    }

    async function updateFinancialData() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-DO', { 
            hour: '2-digit', 
            minute: '2-digit'
        });

        try {
            currentExchangeRate = await fetchExchangeRate();
            currentInterestRate = getDominicanInterestRate();

            if(exchangeRateElement) exchangeRateElement.textContent = `1 USD = ${currentExchangeRate.toFixed(2)} DOP`;
            if(exchangeRateTimeElement) exchangeRateTimeElement.textContent = `Actualizado hoy, ${timeString}`;
            if(interestRateElement) interestRateElement.textContent = `${currentInterestRate.toFixed(2)}%`;

            if(amountUSD.value) calculateDOPEquivalent();
        } catch(error) {
            console.error('Error updating rates:', error);
            if(exchangeRateElement) exchangeRateElement.textContent = `1 USD = 56.50 DOP`;
            if(exchangeRateTimeElement) exchangeRateTimeElement.textContent = `Actualizado hoy, ${timeString}`;
            if(interestRateElement) interestRateElement.textContent = `6.50%`;
        }
    }

    function calculateDOPEquivalent() {
        if (amountUSD.value && !isNaN(amountUSD.value)) {
            const usdAmount = parseFloat(amountUSD.value);
            const paymentType = document.getElementById('paymentType').value;
            const interestApplied = paymentType === 'credit-card' ? usdAmount * (currentInterestRate / 100) : 0;
            const totalUSD = usdAmount + interestApplied;
            const dopAmount = totalUSD * currentExchangeRate;
            
            amountDOP.value = dopAmount.toFixed(2);
            updateInterestBreakdown(usdAmount, interestApplied, totalUSD);
        } else {
            amountDOP.value = '';
            clearInterestBreakdown();
        }
    }

    function updateInterestBreakdown(principal, interest, total) {
        let breakdown = document.getElementById('interestBreakdown');
        
        if (interest > 0) {
            if (!breakdown) {
                breakdown = document.createElement('div');
                breakdown.id = 'interestBreakdown';
                breakdown.className = 'alert alert-warning mt-3';
                amountDOP.parentNode.appendChild(breakdown);
            }
            
            breakdown.innerHTML = `
                <small>
                    <strong>Desglose:</strong><br>
                    - Monto principal: $${principal.toFixed(2)}<br>
                    - Interés (${currentInterestRate}%): $${interest.toFixed(2)}<br>
                    - Total a pagar: $${total.toFixed(2)}
                </small>
            `;
        } else if (breakdown) {
            breakdown.remove();
        }
    }

    function loadPaymentHistory() {
        if(!paymentHistory) return;
        paymentHistory.innerHTML = '';
        
        samplePayments.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.date}</td>
                <td>${payment.destination}</td>
                <td>$${payment.amount.toFixed(2)}</td>
                <td><span class="badge bg-success">${payment.status}</span></td>
            `;
            paymentHistory.appendChild(row);
        });
    }

    function showConfirmation() {
        const beneficiary = document.getElementById('beneficiary')?.value || '';
        const usdAmount = amountUSD.value || '0';
        const dopAmount = amountDOP.value || '0';
        const paymentTypeSelect = document.getElementById('paymentType');
        const paymentType = paymentTypeSelect ? paymentTypeSelect.options[paymentTypeSelect.selectedIndex]?.text : '';

        const now = new Date();
        const confirmationNumber = `BP-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        if(document.getElementById('confirmationNumber')) document.getElementById('confirmationNumber').textContent = confirmationNumber;
        if(document.getElementById('confirmationBeneficiary')) document.getElementById('confirmationBeneficiary').textContent = paymentType ? `${paymentType}: ${beneficiary}` : beneficiary;
        if(document.getElementById('confirmationAmountUSD')) document.getElementById('confirmationAmountUSD').textContent = `$${parseFloat(usdAmount).toFixed(2)}`;
        if(document.getElementById('confirmationAmountDOP')) document.getElementById('confirmationAmountDOP').textContent = `RD$${parseFloat(dopAmount).toFixed(2)}`;
        if(document.getElementById('confirmationDate')) document.getElementById('confirmationDate').textContent = now.toLocaleString('es-DO', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        if(confirmationModal) confirmationModal.show();
        if(paymentForm) paymentForm.reset();
        if(beneficiary && usdAmount !== '0') addToHistory(beneficiary, usdAmount);
    }

    function addToHistory(destination, amount) {
        const now = new Date();
        samplePayments.unshift({
            date: now.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            destination: destination,
            amount: parseFloat(amount),
            status: 'Completado'
        });
        loadPaymentHistory();
    }

    // Initialize
    loadPaymentHistory();
    updateFinancialData();
    setInterval(updateFinancialData, 3600000);
    
    amountUSD.addEventListener('input', calculateDOPEquivalent);
    document.getElementById('paymentType').addEventListener('change', calculateDOPEquivalent);
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (paymentForm.checkValidity()) {
            showConfirmation();
        } else {
            paymentForm.classList.add('was-validated');
        }
    });

    document.getElementById('printReceipt').addEventListener('click', function() {
        window.print();
    });
});
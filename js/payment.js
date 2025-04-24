document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const paymentForm = document.getElementById('dollarPaymentForm');
    const amountUSD = document.getElementById('amountUSD');
    const amountDOP = document.getElementById('amountDOP');
    const exchangeRateElement = document.getElementById('exchangeRate');
    const exchangeRateTimeElement = document.getElementById('exchangeRateTime');
    const interestRateElement = document.getElementById('currentInterestRate');
    const paymentHistory = document.getElementById('paymentHistory');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

    // Variables globales con valores por defecto para RD
    let currentExchangeRate = 56.50;
    let currentInterestRate = 6.50; // Tasa promedio para RD
    
    // Historial de pagos de ejemplo
    const samplePayments = [
        { date: '15/06/2023', destination: 'Visa Platinum', amount: 150.00, status: 'Completado' },
        { date: '10/06/2023', destination: 'Amazon Prime', amount: 12.99, status: 'Completado' },
        { date: '01/06/2023', destination: 'Netflix', amount: 10.99, status: 'Completado' }
    ];

    // Obtener tipo de cambio de API pública
    async function fetchExchangeRate() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            return data.rates.DOP || 56.50; // Fallback para RD
        } catch (error) {
            console.log('Usando valor por defecto para tasa de cambio');
            return 56.50;
        }
    }

    // Generar tasa de interés realista para RD
    function getDominicanInterestRate() {
        // Simular pequeña variación (±0.15%)
        const variation = (Math.random() * 0.3 - 0.15);
        return Math.max(6.0, Math.min(7.0, currentInterestRate + variation));
    }

    // Actualizar datos financieros
    async function updateFinancialData() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-DO', { 
            hour: '2-digit', 
            minute: '2-digit'
        });

        // Obtener y actualizar tasas
        currentExchangeRate = await fetchExchangeRate();
        currentInterestRate = getDominicanInterestRate();

        // Actualizar UI
        exchangeRateElement.textContent = `1 USD = ${currentExchangeRate.toFixed(2)} DOP`;
        exchangeRateTimeElement.textContent = `Actualizado hoy, ${timeString}`;
        interestRateElement.textContent = `${currentInterestRate.toFixed(2)}%`;

        // Recalcular si hay montos ingresados
        if (amountUSD.value) calculateDOPEquivalent();
    }

    // Calcular equivalente en DOP con interés
    function calculateDOPEquivalent() {
        if (amountUSD.value && !isNaN(amountUSD.value)) {
            const usdAmount = parseFloat(amountUSD.value);
            const paymentType = document.getElementById('paymentType').value;
            
            // Aplicar interés solo para tarjetas de crédito
            const interestApplied = paymentType === 'credit-card' ? 
                usdAmount * (currentInterestRate / 100) : 0;
            
            const totalUSD = usdAmount + interestApplied;
            const dopAmount = totalUSD * currentExchangeRate;
            
            amountDOP.value = dopAmount.toFixed(2);
            
            // Mostrar desglose de intereses si aplica
            updateInterestBreakdown(usdAmount, interestApplied, totalUSD);
        } else {
            amountDOP.value = '';
            clearInterestBreakdown();
        }
    }

    // Mostrar desglose de intereses
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

    function clearInterestBreakdown() {
        const breakdown = document.getElementById('interestBreakdown');
        if (breakdown) breakdown.remove();
    }

    // Cargar historial de pagos
    function loadPaymentHistory() {
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

    // Mostrar confirmación de pago
    function showConfirmation() {
        const beneficiary = document.getElementById('beneficiary').value;
        const usdAmount = amountUSD.value;
        const dopAmount = amountDOP.value;
        const paymentType = document.getElementById('paymentType').options[document.getElementById('paymentType').selectedIndex].text;
        const now = new Date();

        // Actualizar modal
        document.getElementById('confirmationNumber').textContent = 
            `BP-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        document.getElementById('confirmationBeneficiary').textContent = `${paymentType}: ${beneficiary}`;
        document.getElementById('confirmationAmountUSD').textContent = `$${parseFloat(usdAmount).toFixed(2)}`;
        document.getElementById('confirmationAmountDOP').textContent = `RD$${parseFloat(dopAmount).toFixed(2)}`;
        document.getElementById('confirmationDate').textContent = now.toLocaleString('es-DO', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        confirmationModal.show();
        paymentForm.reset();
        addToHistory(beneficiary, usdAmount);
    }

    // Agregar pago al historial
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

    // Inicialización
    loadPaymentHistory();
    updateFinancialData();
    setInterval(updateFinancialData, 3600000); // Actualizar cada hora
    
    // Event listeners
    amountUSD.addEventListener('input', calculateDOPEquivalent);
    document.getElementById('paymentType').addEventListener('change', calculateDOPEquivalent);
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (paymentForm.checkValidity()) {
            showConfirmation();
        } else {
            e.stopPropagation();
            paymentForm.classList.add('was-validated');
        }
    });

    document.getElementById('printReceipt').addEventListener('click', function() {
        window.print();
    });
});
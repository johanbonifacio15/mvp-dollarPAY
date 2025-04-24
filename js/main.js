document.addEventListener('DOMContentLoaded', function() {
    // Simular el proceso de pago
    const paymentForm = document.getElementById('paymentForm');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const cardSelect = document.getElementById('cardSelect');
        const amount = document.getElementById('amount');
        const accountSelect = document.getElementById('accountSelect');
        
        // Validación básica
        if (!cardSelect.value || !amount.value || !accountSelect.value) {
            alert('Por favor complete todos los campos requeridos.');
            return;
        }
        
        if (parseFloat(amount.value) < 10) {
            alert('El monto mínimo de pago es USD 10.00');
            return;
        }
        
        // Mostrar datos en el modal de confirmación
        document.getElementById('confirmedAmount').textContent = amount.value;
        document.getElementById('confirmedCard').textContent = cardSelect.options[cardSelect.selectedIndex].text.split(' (')[0];
        
        // Generar número de transacción aleatorio
        const transactionNumber = Math.floor(100000000 + Math.random() * 900000000);
        document.getElementById('transactionNumber').textContent = transactionNumber;
        
        // Mostrar fecha y hora actual
        const now = new Date();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        document.getElementById('transactionDate').textContent = now.toLocaleDateString('es-DO', options);
        
        // Mostrar modal
        confirmationModal.show();
        
        // Limpiar formulario (simulación)
        paymentForm.reset();
    });
    
    // Simular cambio en el tipo de cambio cada 10 segundos (solo demostración)
    setInterval(function() {
        const exchangeRateElement = document.querySelector('.card-body.text-center h4');
        if (exchangeRateElement) {
            const randomChange = (Math.random() * 0.5 - 0.25).toFixed(2);
            const currentRateText = exchangeRateElement.textContent;
            const currentRate = parseFloat(currentRateText.split('= ')[1].split(' ')[0]);
            const newRate = (currentRate + parseFloat(randomChange)).toFixed(2);
            exchangeRateElement.textContent = `1 USD = ${newRate} DOP`;
            
            // Actualizar también la hora
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
            document.querySelector('.card-body.text-center small').textContent = `Actualizado hoy, ${timeString}`;
        }
    }, 10000);
});
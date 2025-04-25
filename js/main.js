document.addEventListener('DOMContentLoaded', function() {
    // Simular cambio en el tipo de cambio cada 10 segundos
    setInterval(function() {
        const exchangeRateElement = document.querySelector('.card-body.text-center h4');
        if (exchangeRateElement) {
            const randomChange = (Math.random() * 0.5 - 0.25).toFixed(2);
            const currentRateText = exchangeRateElement.textContent;
            const currentRate = parseFloat(currentRateText.split('= ')[1].split(' ')[0]);
            const newRate = (currentRate + parseFloat(randomChange)).toFixed(2);
            exchangeRateElement.textContent = `1 USD = ${newRate} DOP`;
            
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
            document.querySelector('.card-body.text-center small').textContent = `Actualizado hoy, ${timeString}`;
        }
    }, 10000);
});
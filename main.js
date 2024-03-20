// Función para calcular la cuota fija de un préstamo
function calcularCuotaFija(monto, tasaInteres, periodos) {
    const tasaDecimal = tasaInteres / 100;
    return monto * (tasaDecimal / (1 - Math.pow(1 + tasaDecimal, -periodos)));
}

// Función principal para calcular el préstamo y mostrar los resultados
function calcularPrestamo() {
    const monto = parseFloat(document.getElementById('montoInput').value);
    const tasaInteres = parseFloat(document.getElementById('tasaInput').value);
    const periodos = parseInt(document.getElementById('periodosInput').value);
    const cuotaFija = calcularCuotaFija(monto, tasaInteres, periodos);
    mostrarResultados(cuotaFija, periodos);
}

function mostrarResultados(cuotaFija, periodos) {

    const resultadoFormateado = cuotaFija.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
    });

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<p>Cuota mensual fija: ${resultadoFormateado} por un total de ${periodos} períodos.</p>`;
}


// Event listener para el botón de calcular
document.getElementById('calcularBtn').addEventListener('click', calcularPrestamo);


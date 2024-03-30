// Calcular la cuota fija
function calcularCuotaFija(monto, tasaInteres, periodos) {
    const tasaDecimal = tasaInteres / 100;
    return monto * (tasaDecimal / (1 - Math.pow(1 + tasaDecimal, -periodos)));
}

// Función principal
function calcularPrestamo() {
    const monto = parseFloat(document.getElementById('montoInput').value);
    const tasaInteres = parseFloat(document.getElementById('tasaInput').value);
    const periodos = parseInt(document.getElementById('periodosInput').value);

    // Validación de datos con condicionales
    if (isNaN(monto) || monto <= 0) {
        alert('Por favor, ingrese un monto válido.');
        return;
    }
    if (isNaN(tasaInteres) || tasaInteres <= 0) {
        alert('Por favor, ingrese una tasa de interés válida.');
        return;
    }
    if (isNaN(periodos) || periodos <= 0) {
        alert('Por favor, ingrese un número de periodos válido.');
        return;
    }

    const cuotaFija = calcularCuotaFija(monto, tasaInteres, periodos);
    mostrarResultados(cuotaFija, periodos);
}

function mostrarResultados(cuotaFija, periodos) {
    // Mensaje simple con el resultado
    let mensajeResultado = `Cuota mensual fija: ${cuotaFija.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
    })} por un total de ${periodos} períodos.`;

    // CICLO
    for (let i = 0; i < 1; i++) {
        document.getElementById('resultado').innerHTML = mensajeResultado;
    }
}

// Event listener
document.getElementById('calcularBtn').addEventListener('click', calcularPrestamo);

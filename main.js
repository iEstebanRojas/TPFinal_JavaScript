// Array para almacenar historial de préstamos
let historialCalculos = [];

// Funcion para calcular la cuota
function calcularCuotaFija(monto, tasaInteres, periodos) {
    const tasaDecimal = tasaInteres / 100 / 12; // Convertir la tasa anual en mensual
    return monto * (tasaDecimal / (1 - Math.pow(1 + tasaDecimal, -periodos)));
}

// Función para registrar cada cálculo
function registrarCalculo(fecha, monto, tasaInteres, periodos, cuotaFija) {
    historialCalculos.push({
        fecha: new Date(fecha),
        monto: monto,
        tasaInteres: tasaInteres,
        periodos: periodos,
        cuotaFija: cuotaFija
    });
}

// Función para mostrar historial
function mostrarHistorialCalculos() {
    let registros = '<strong>Historial de Cálculos:</strong><br>';
    historialCalculos.forEach(registro => {
        registros += `Fecha: ${registro.fecha.toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'})}, Monto: ${registro.monto}, Tasa: ${registro.tasaInteres}%, Cuotas: ${registro.periodos}, Cuota Fija: ${registro.cuotaFija.toFixed(2)}<br>`;
    });
    document.getElementById('historialCalculos').innerHTML = registros;
}

// Función principal para calcular el préstamo y actualizar xon los resultados.
function calcularPrestamo() {
    const monto = parseFloat(document.getElementById('montoInput').value);
    const tasaInteres = parseFloat(document.getElementById('tasaInput').value);
    const periodos = parseInt(document.getElementById('periodosInput').value);
    const fechaInicio = document.getElementById('fechaInicio').value;

    if (isNaN(monto) || monto <= 0 || isNaN(tasaInteres) || tasaInteres <= 0 || isNaN(periodos) || periodos <= 0 || fechaInicio === '') {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    const cuotaFija = calcularCuotaFija(monto, tasaInteres, periodos);
    registrarCalculo(fechaInicio, monto, tasaInteres, periodos, cuotaFija);
    mostrarResultados(cuotaFija, periodos);
    mostrarHistorialCalculos();
}

// Función para mostrar los resultados
function mostrarResultados(cuotaFija, periodos) {
    let mensajeResultado = `Cuota mensual fija: ${cuotaFija.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    })} por un total de ${periodos} períodos.`;
    document.getElementById('resultado').innerHTML = mensajeResultado;
}

// Función para buscar cálculos por tasa de interés específica
function buscarPorTasaInteres(tasaBuscada) {
    let resultados = historialCalculos.filter(calculo => calculo.tasaInteres === tasaBuscada);
    let mensajeResultado = `<strong>Resultados de búsqueda para tasa de interés ${tasaBuscada}%:</strong><br>`;
    if (resultados.length > 0) {
        resultados.forEach(registro => {
            mensajeResultado += `Fecha: ${registro.fecha.toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'})}, Monto: ${registro.monto}, Cuotas: ${registro.periodos}, Cuota Fija: ${registro.cuotaFija.toFixed(2)}<br>`;
        });
    } else {
        mensajeResultado += 'No se encontraron cálculos con esta tasa de interés.';
    }
    document.getElementById('resultadosBusqueda').innerHTML = mensajeResultado;
}

document.getElementById('calcularBtn').addEventListener('click', calcularPrestamo);

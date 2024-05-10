// Array para almacenar historial de préstamos
let historialCalculos = [];

// Función para calcular la cuota
function calcularCuotaFija(monto, tasaInteres, periodos) {
    const tasaDecimal = tasaInteres / 100 / 12; // Convertir tasa anual en mensual
    return monto * (tasaDecimal / (1 - Math.pow(1 + tasaDecimal, -periodos)));
}

// Función para registrar cada cálculo
function registrarCalculo(fecha, monto, tasaInteres, periodos, cuotaFija) {
    const fechaCorregida = new Date(fecha + 'T12:00:00'); // Ajustar para zona horaria correctamente
    historialCalculos.push({
        fecha: fechaCorregida,
        monto: monto,
        tasaInteres: tasaInteres.toFixed(2),
        periodos: periodos,
        cuotaFija: cuotaFija
    });
    guardarHistorial();
}

// Función para mostrar historial
function mostrarHistorialCalculos() {
    let registros = '<strong>Historial de Cálculos:</strong><br>';
    historialCalculos.forEach(registro => {
        if (registro.fecha instanceof Date) {
            registros += `Fecha: ${registro.fecha.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}, Monto: ${registro.monto}, Tasa: ${registro.tasaInteres}%, Cuotas: ${registro.periodos}, Cuota Fija: ${registro.cuotaFija.toFixed(2)}<br>`;
        } else {
            console.error('La fecha no es un objeto Date:', registro.fecha);
        }
    });
    document.getElementById('historialCalculos').innerHTML = registros;
}

// Función principal para calcular el préstamo y actualizar con los resultados.
function calcularPrestamo() {
    const monto = parseFloat(document.getElementById('montoInput').value);
    const tasaInteres = parseFloat(document.getElementById('tasaInput').value);
    const periodos = parseInt(document.getElementById('periodosInput').value);
    const fechaInicio = document.getElementById('fechaInicio').value;

    if (isNaN(monto) || monto <= 0 || isNaN(tasaInteres) || tasaInteres <= 0 || isNaN(periodos) || periodos <= 0 || fechaInicio === '') {
        mostrarError('Por favor, complete todos los campos correctamente.');
        return;
    }

    const cuotaFija = calcularCuotaFija(monto, tasaInteres, periodos);
    registrarCalculo(fechaInicio, monto, tasaInteres, periodos, cuotaFija);
    mostrarResultados(cuotaFija, periodos, fechaInicio);
    mostrarHistorialCalculos();
}

// Función para generar fechas de cuotas
function generarFechasCuotas(fechaInicio, periodos) {
    let fechas = [];
    let fechaActual = new Date(fechaInicio + 'T12:00:00');
    for (let i = 0; i < periodos; i++) {
        let nuevaFecha = new Date(fechaActual);
        nuevaFecha.setDate(fechaActual.getDate() + 30 * (i + 1)); // Añadir 30 días para cada cuota
        fechas.push(nuevaFecha);
    }
    return fechas;
}

// Función para mostrar los resultados y las fechas de las cuotas
function mostrarResultados(cuotaFija, periodos, fechaInicio) {
    let mensajeResultado = `Cuota mensual fija: ${cuotaFija.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    })} por un total de ${periodos} períodos.<br>`;

    let fechasCuotas = generarFechasCuotas(fechaInicio, periodos);
    mensajeResultado += "<strong>Fechas de Cuotas:</strong><br>";
    fechasCuotas.forEach((fecha, index) => {
        mensajeResultado += `Cuota ${index + 1}: ${fecha.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}<br>`;
    });

    document.getElementById('resultado').innerHTML = mensajeResultado;
}

// Función para mostrar mensajes de error en la página
function mostrarError(mensaje) {
    const divError = document.getElementById('errores');
    divError.innerHTML = `<p class='error'>${mensaje}</p>`;
    setTimeout(() => divError.innerHTML = '', 3000);  // Limpiar mensaje después de 3 segundos
}

// Función para buscar por tasa de interés
function buscarPorTasaInteres(tasaBuscada) {

    // Convertir la tasa buscada en un número con una precisión fija
    const tasaBuscadaPrecisa = parseFloat(tasaBuscada).toFixed(2);

    // Variable para almacenar el resultado encontrado
    let resultadoEncontrado = null;
    
    historialCalculos.forEach(calculo => {
        const tasaAlmacenadaRedondeada = parseFloat(calculo.tasaInteres).toFixed(2);

        // Si la tasa almacenada coincide con la tasa buscada, almacenar este resultado y salir del bucle
        if (tasaAlmacenadaRedondeada === tasaBuscadaPrecisa) {
            resultadoEncontrado = calculo;
            return;
        }
    });

    // Mostrar el resultado encontrado o un mensaje si no se encontraron coincidencias
    if (resultadoEncontrado !== null) {
        let mensajeResultado = `<strong>Resultado de búsqueda para tasa de interés ${tasaBuscada}%:</strong><br>`;
        let fechaAlmacenada = resultadoEncontrado.fecha instanceof Date ? resultadoEncontrado.fecha.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : resultadoEncontrado.fecha;
        let cuotaFijaFormateada = isNaN(resultadoEncontrado.cuotaFija) ? 'No disponible' : (Number(resultadoEncontrado.cuotaFija)).toFixed(2);
        mensajeResultado += `Fecha: ${fechaAlmacenada}, Monto: ${resultadoEncontrado.monto}, Cuotas: ${resultadoEncontrado.periodos}, Cuota Fija: ${cuotaFijaFormateada}<br>`;
        document.getElementById('resultadosBusqueda').innerHTML = mensajeResultado;
    } else {
        document.getElementById('resultadosBusqueda').innerHTML = 'No se encontraron cálculos con esta tasa de interés.';
    }
}

// Guardar historial en localStorage
function guardarHistorial() {
    localStorage.setItem('historialCalculos', JSON.stringify(historialCalculos));
}

// Función para cargar historial desde localStorage al cargar la página
function cargarHistorial() {
    historialCalculos = JSON.parse(localStorage.getItem('historialCalculos')) || [];
    mostrarHistorialCalculos();
}

// Eventos
document.addEventListener('DOMContentLoaded', cargarHistorial);
document.getElementById('calcularBtn').addEventListener('click', calcularPrestamo);
document.getElementById('tasaBusqueda').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        buscarPorTasaInteres(document.getElementById('tasaBusqueda').value);
    }
});

document.getElementById('buscarBtn').addEventListener('click', function() {
    console.log('El botón de búsqueda fue clickeado');
    const tasaBuscada = document.getElementById('tasaBusqueda').value;
    buscarPorTasaInteres(tasaBuscada);
});

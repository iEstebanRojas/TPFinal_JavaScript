// Array para almacenar historial de préstamos
let historialCalculos = [];

// Guardar referencias a los elementos
const $montoInput = $('#montoInput');
const $tasaInput = $('#tasaInput');
const $periodosInput = $('#periodosInput');
const $fechaInicio = $('#fechaInicio');
const $resultado = $('#resultado');
const $historialCalculos = $('#historialCalculos');
const $errores = $('#errores');
const $notification = $('#notification');

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
    guardarHistorial(); // Guardar historial en localStorage
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
    $historialCalculos.html(registros);
}

// Función principal para calcular el préstamo y actualizar con los resultados.
function calcularPrestamo() {
    let esValido = true;
    $('.error-message').text('');  // Limpiar mensajes de error anteriores

    const monto = parseFloat($montoInput.val());
    if (isNaN(monto) || monto <= 0) {
        mostrarErrorEspecifico('montoInput', 'Por favor, ingrese un monto válido.');
        esValido = false;
    }

    const tasaInteres = parseFloat($tasaInput.val());
    if (isNaN(tasaInteres) || tasaInteres <= 0) {
        mostrarErrorEspecifico('tasaInput', 'Por favor, ingrese una tasa de interés válida.');
        esValido = false;
    }

    const periodos = parseInt($periodosInput.val());
    if (isNaN(periodos) || periodos <= 0) {
        mostrarErrorEspecifico('periodosInput', 'Por favor, ingrese un número de cuotas válido.');
        esValido = false;
    }

    const fechaInicio = $fechaInicio.val();
    if (fechaInicio === '') {
        mostrarErrorEspecifico('fechaInicio', 'Por favor, seleccione una fecha de inicio.');
        esValido = false;
    }

    if (!esValido) {
        return;
    }

    const cuotaFija = calcularCuotaFija(monto, tasaInteres, periodos);
    registrarCalculo(fechaInicio, monto, tasaInteres, periodos, cuotaFija);
    mostrarResultados(cuotaFija, periodos, fechaInicio);
    mostrarHistorialCalculos();
    mostrarNotificacion("Cálculo realizado con éxito.");
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

    $resultado.html(mensajeResultado).hide().fadeIn('slow');
}

// Función para mostrar mensajes de error específicos
function mostrarErrorEspecifico(campo, mensaje) {
    $(`#${campo}Error`).text(mensaje).hide().fadeIn('slow');
}

// Función para mostrar mensajes de error en la página
function mostrarError(mensaje) {
    $errores.html(`<p class='error'>${mensaje}</p>`).hide().slideDown();
    setTimeout(() => $errores.slideUp(), 3000);  // Limpiar mensaje después de 3 segundos
}

// Función para buscar por tasa de interés
function buscarPorTasaInteres(tasaBuscada) {
    const tasaBuscadaPrecisa = parseFloat(tasaBuscada).toFixed(2);
    let resultadoEncontrado = null;
    
    historialCalculos.forEach(calculo => {
        const tasaAlmacenadaRedondeada = parseFloat(calculo.tasaInteres).toFixed(2);
        if (tasaAlmacenadaRedondeada === tasaBuscadaPrecisa) {
            resultadoEncontrado = calculo;
            return;
        }
    });

    if (resultadoEncontrado !== null) {
        let mensajeResultado = `<strong>Resultado de búsqueda para tasa de interés ${tasaBuscada}%:</strong><br>`;
        let fechaAlmacenada = resultadoEncontrado.fecha instanceof Date ? resultadoEncontrado.fecha.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : resultadoEncontrado.fecha;
        let cuotaFijaFormateada = isNaN(resultadoEncontrado.cuotaFija) ? 'No disponible' : (Number(resultadoEncontrado.cuotaFija)).toFixed(2);
        mensajeResultado += `Fecha: ${fechaAlmacenada}, Monto: ${resultadoEncontrado.monto}, Cuotas: ${resultadoEncontrado.periodos}, Cuota Fija: ${cuotaFijaFormateada}<br>`;
        $('#resultadosBusqueda').html(mensajeResultado);
    } else {
        $('#resultadosBusqueda').html('No se encontraron cálculos con esta tasa de interés.');
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    $notification.text(mensaje).addClass('show');
    setTimeout(() => {
        $notification.removeClass('show');
    }, 5000);
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

// Función para alternar entre modo claro y oscuro
function alternarTema() {
    $('body').toggleClass('dark-mode');
}

// Eventos
$(document).ready(function() {
    cargarHistorial();

    $('#calcularBtn').on('click', calcularPrestamo);
    $('#tasaBusqueda').on('keyup', function(event) {
        if (event.key === 'Enter') {
            buscarPorTasaInteres($('#tasaBusqueda').val());
        }
    });

    $('#buscarBtn').on('click', function() {
        console.log('El botón de búsqueda fue clickeado');
        const tasaBuscada = $('#tasaBusqueda').val();
        buscarPorTasaInteres(tasaBuscada);
    });

    $('#themeToggle').on('click', alternarTema);

    // Simulación de llamada AJAX para obtener tasas de interés
    obtenerTasasDeInteres().then(tasas => {
        console.log('Tasas de interés obtenidas del servidor:', tasas);
    });
});

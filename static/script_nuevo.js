// Variables globales
let estadoJuego = null;
let juegoEnCurso = false;

// Elementos del DOM
let btnEstablecerPregunta, btnBarajar, btnRepartir, btnNuevoJuego;
let preguntaInput, mensajes, barajadoArea, tablero, preguntaActual, montonActual, ultimaCarta;

// Inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    inicializarElementos();
    configurarEventListeners();
    obtenerEstadoJuego();
});

function inicializarElementos() {
    btnEstablecerPregunta = document.getElementById('btnEstablecerPregunta');
    btnBarajar = document.getElementById('btnBarajar');
    btnRepartir = document.getElementById('btnRepartir');
    btnNuevoJuego = document.getElementById('btnNuevoJuego');
    preguntaInput = document.getElementById('pregunta');
    mensajes = document.getElementById('mensajes');
    barajadoArea = document.getElementById('barajado-area');
    tablero = document.getElementById('tablero');
    preguntaActual = document.getElementById('preguntaActual');
    montonActual = document.getElementById('montonActual');
    ultimaCarta = document.getElementById('ultimaCarta');
}

function configurarEventListeners() {
    btnEstablecerPregunta.addEventListener('click', establecerPregunta);
    btnBarajar.addEventListener('click', barajarCartas);
    btnRepartir.addEventListener('click', repartirCartas);
    btnNuevoJuego.addEventListener('click', nuevoJuego);
    
    // Event listeners para los montones
    configurarEventListenersMontones();
}

function configurarEventListenersMontones() {
    for (let i = 1; i <= 13; i++) {
        const monton = document.getElementById(`monton-${i}`);
        if (monton) {
            monton.addEventListener('click', () => hacerJugada(i));
        }
    }
}

function establecerPregunta() {
    const pregunta = preguntaInput.value.trim();
    if (!pregunta) {
        mostrarMensaje('⚠️ Por favor, escribe tu pregunta primero.');
        return;
    }

    fetch('/establecer_pregunta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pregunta: pregunta })
    })
    .then(response => response.json())
    .then(data => {
        mostrarMensaje(`✅ Pregunta establecida: "${pregunta}"`);
        preguntaActual.textContent = pregunta;
        btnBarajar.disabled = false;
        btnEstablecerPregunta.disabled = true;
        preguntaInput.disabled = true;
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('❌ Error al establecer la pregunta');
    });
}

function barajarCartas() {
    mostrarMensaje('🔄 Barajando cartas...');
    barajadoArea.style.display = 'block';
    btnBarajar.disabled = true;
    
    // Animación de barajado
    setTimeout(() => {
        fetch('/barajar_cartas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            mostrarMensaje('✅ Cartas barajadas exitosamente');
            barajadoArea.style.display = 'none';
            btnRepartir.disabled = false;
            estadoJuego = data.estado;
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('❌ Error al barajar cartas');
            barajadoArea.style.display = 'none';
        });
    }, 3000);
}

function repartirCartas() {
    mostrarMensaje('🎴 Repartiendo cartas...');
    btnRepartir.disabled = true;
    
    fetch('/repartir_cartas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        estadoJuego = data.estado;
        mostrarMensaje(estadoJuego.mensaje);
        actualizarInterfaz();
        juegoEnCurso = true;
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('❌ Error al repartir cartas');
    });
}

function hacerJugada(montonId) {
    if (!juegoEnCurso || estadoJuego.estado !== 'jugando') {
        return;
    }
    
    if (montonId !== estadoJuego.montonActual) {
        mostrarMensaje(`⚠️ Debes jugar en el montón ${obtenerNombreCarta(estadoJuego.montonActual)}`);
        return;
    }
    
    fetch('/hacer_jugada', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ montonId: montonId })
    })
    .then(response => response.json())
    .then(data => {
        estadoJuego = data.estado;
        mostrarMensaje(estadoJuego.mensaje);
        
        if (data.carta_volteada) {
            ultimaCarta.textContent = data.carta_volteada;
        }
        
        if (data.terminado) {
            juegoEnCurso = false;
            mostrarResultado(data.resultado);
        }
        
        actualizarInterfaz();
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('❌ Error al hacer jugada');
    });
}

function nuevoJuego() {
    fetch('/nuevo_juego', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        estadoJuego = data.estado;
        juegoEnCurso = false;
        reiniciarInterfaz();
        mostrarMensaje('🎯 Nuevo juego creado. Haz tu pregunta y comienza.');
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('❌ Error al crear nuevo juego');
    });
}

function obtenerEstadoJuego() {
    fetch('/estado_juego')
    .then(response => response.json())
    .then(data => {
        estadoJuego = data;
        actualizarInterfaz();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function actualizarInterfaz() {
    if (!estadoJuego) return;
    
    // Actualizar información del juego
    montonActual.textContent = obtenerNombreCarta(estadoJuego.montonActual);
    
    if (estadoJuego.pregunta) {
        preguntaActual.textContent = estadoJuego.pregunta;
    }
    
    // Actualizar montones
    actualizarMontones();
    
    // Resaltar montón actual
    resaltarMontonActual();
}

function actualizarMontones() {
    for (let i = 1; i <= 13; i++) {
        const monton = document.getElementById(`monton-${i}`);
        if (monton) {
            const cartasBocaAbajo = monton.querySelector('.cartas-boca-abajo');
            const cartasBocaArriba = monton.querySelector('.cartas-boca-arriba');
            
            // Limpiar montón
            cartasBocaAbajo.innerHTML = '';
            cartasBocaArriba.innerHTML = '';
            
            // Agregar cartas boca abajo
            const numBocaAbajo = estadoJuego.cartas_boca_abajo[i] || 0;
            for (let j = 0; j < numBocaAbajo; j++) {
                const carta = document.createElement('div');
                carta.className = 'carta carta-boca-abajo';
                cartasBocaAbajo.appendChild(carta);
            }
            
            // Agregar cartas boca arriba
            const numBocaArriba = estadoJuego.cartas_boca_arriba[i] || 0;
            for (let j = 0; j < numBocaArriba; j++) {
                const carta = document.createElement('div');
                carta.className = 'carta carta-boca-arriba';
                
                // Mostrar la carta más reciente
                if (j === numBocaArriba - 1 && estadoJuego.montones_boca_arriba[i] && estadoJuego.montones_boca_arriba[i].length > 0) {
                    carta.textContent = estadoJuego.montones_boca_arriba[i][estadoJuego.montones_boca_arriba[i].length - 1];
                }
                
                cartasBocaArriba.appendChild(carta);
            }
        }
    }
}

function resaltarMontonActual() {
    // Quitar resaltado de todos los montones
    for (let i = 1; i <= 13; i++) {
        const monton = document.getElementById(`monton-${i}`);
        if (monton) {
            monton.classList.remove('activo');
        }
    }
    
    // Resaltar montón actual
    if (estadoJuego.estado === 'jugando') {
        const montonActivo = document.getElementById(`monton-${estadoJuego.montonActual}`);
        if (montonActivo) {
            montonActivo.classList.add('activo');
        }
    }
}

function mostrarMensaje(mensaje) {
    mensajes.innerHTML = `<p>${mensaje}</p>`;
}

function mostrarResultado(resultado) {
    const resultadoDiv = document.getElementById('resultado');
    const resultadoMensaje = resultadoDiv.querySelector('.resultado-mensaje');
    const resultadoInterpretacion = resultadoDiv.querySelector('.resultado-interpretacion');
    
    if (resultado === 'positivo') {
        resultadoMensaje.textContent = '¡SÍ! Tu deseo se cumplirá ✨';
        resultadoInterpretacion.textContent = 'Las fuerzas del universo están a tu favor. Tu pregunta ha sido respondida de manera positiva.';
        resultadoMensaje.style.color = '#4CAF50';
    } else {
        resultadoMensaje.textContent = 'No, tu deseo no se cumplirá ❌';
        resultadoInterpretacion.textContent = 'Este no es el momento adecuado. Las cartas sugieren paciencia y reflexión.';
        resultadoMensaje.style.color = '#f44336';
    }
    
    resultadoDiv.style.display = 'flex';
    
    // Cerrar modal al hacer clic fuera
    resultadoDiv.addEventListener('click', function(e) {
        if (e.target === resultadoDiv) {
            resultadoDiv.style.display = 'none';
        }
    });
}

function reiniciarInterfaz() {
    // Reiniciar botones
    btnEstablecerPregunta.disabled = false;
    btnBarajar.disabled = true;
    btnRepartir.disabled = true;
    
    // Reiniciar campos
    preguntaInput.disabled = false;
    preguntaInput.value = '';
    preguntaActual.textContent = '-';
    montonActual.textContent = 'AS';
    ultimaCarta.textContent = '-';
    
    // Ocultar áreas
    barajadoArea.style.display = 'none';
    const resultado = document.getElementById('resultado');
    if (resultado) {
        resultado.style.display = 'none';
    }
    
    // Limpiar montones
    for (let i = 1; i <= 13; i++) {
        const monton = document.getElementById(`monton-${i}`);
        if (monton) {
            monton.classList.remove('activo');
            const cartasBocaAbajo = monton.querySelector('.cartas-boca-abajo');
            const cartasBocaArriba = monton.querySelector('.cartas-boca-arriba');
            if (cartasBocaAbajo) cartasBocaAbajo.innerHTML = '';
            if (cartasBocaArriba) cartasBocaArriba.innerHTML = '';
        }
    }
}

function obtenerNombreCarta(valor) {
    const nombres = {1: 'AS', 11: 'J', 12: 'Q', 13: 'K'};
    return nombres[valor] || valor.toString();
}

// Efectos de sonido (opcional)
function reproducirSonido(tipo) {
    // Implementar sonidos si se desea
    console.log(`Sonido: ${tipo}`);
}

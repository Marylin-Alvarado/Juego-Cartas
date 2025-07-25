// Variables globales
let estadoJuego = null;
let juegoEnCurso = false;
let cronometro = null;
let tiempoInicio = null;
let puntuacion = 0;
let modoManual = false;
let cartaArrastrada = null;

// Elementos del DOM
let btnEstablecerPregunta, btnBarajar, btnRepartir, btnNuevoJuego;
let btnModoAutomatico, btnModoManual;
let preguntaInput, mensajes, barajadoArea, tablero, preguntaActual, montonActual, ultimaCarta;
let elementoCronometro, elementoPuntuacion;

// Inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    inicializarElementos();
    configurarEventListeners();
    obtenerEstadoJuego();
    inicializarCronometro();
});

function inicializarElementos() {
    btnEstablecerPregunta = document.getElementById('btnEstablecerPregunta');
    btnBarajar = document.getElementById('btnBarajar');
    btnRepartir = document.getElementById('btnRepartir');
    btnNuevoJuego = document.getElementById('btnNuevoJuego');
    btnModoAutomatico = document.getElementById('btnModoAutomatico');
    btnModoManual = document.getElementById('btnModoManual');
    preguntaInput = document.getElementById('pregunta');
    mensajes = document.getElementById('mensajes');
    barajadoArea = document.getElementById('barajado-area');
    tablero = document.getElementById('tablero');
    preguntaActual = document.getElementById('preguntaActual');
    montonActual = document.getElementById('montonActual');
    ultimaCarta = document.getElementById('ultimaCarta');
    elementoCronometro = document.getElementById('cronometro');
    elementoPuntuacion = document.getElementById('puntuacion');
}

// Funciones del cronómetro
function inicializarCronometro() {
    if (elementoCronometro) {
        elementoCronometro.textContent = '00:00';
    }
    if (elementoPuntuacion) {
        elementoPuntuacion.textContent = `Puntuación: ${puntuacion}`;
    }
}

function iniciarCronometro() {
    if (cronometro) {
        clearInterval(cronometro);
    }
    
    tiempoInicio = Date.now();
    cronometro = setInterval(actualizarCronometro, 1000);
}

function pararCronometro() {
    if (cronometro) {
        clearInterval(cronometro);
        cronometro = null;
    }
}

function actualizarCronometro() {
    if (!tiempoInicio) return;
    
    const tiempoTranscurrido = Date.now() - tiempoInicio;
    const segundos = Math.floor(tiempoTranscurrido / 1000);
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    
    const tiempoFormateado = `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
    
    if (elementoCronometro) {
        elementoCronometro.textContent = tiempoFormateado;
    }
}

function actualizarPuntuacion(nuevaPuntuacion) {
    puntuacion = nuevaPuntuacion;
    if (elementoPuntuacion) {
        elementoPuntuacion.textContent = `Puntuación: ${puntuacion}`;
    }
}

// Funciones para cambio de modo
function cambiarModo(esManual) {
    modoManual = esManual;
    
    // Actualizar botones
    btnModoAutomatico.classList.toggle('activo', !esManual);
    btnModoManual.classList.toggle('activo', esManual);
    
    // Configurar drag & drop si es modo manual
    configurarDragDrop();
    
    // Mostrar mensaje
    if (esManual) {
        mostrarMensaje('🖱️ Modo Manual activado. Arrastra las cartas a su posición correcta.');
    } else {
        mostrarMensaje('🤖 Modo Automático activado. Las cartas se colocarán automáticamente.');
    }
}

function configurarDragDrop() {
    const montones = document.querySelectorAll('.monton');
    
    montones.forEach(monton => {
        if (modoManual) {
            // Habilitar drag & drop
            monton.setAttribute('draggable', 'true');
            monton.classList.add('draggable');
            
            // Event listeners para drag
            monton.addEventListener('dragstart', handleDragStart);
            monton.addEventListener('dragend', handleDragEnd);
            
            // Event listeners para drop
            monton.addEventListener('dragover', handleDragOver);
            monton.addEventListener('drop', handleDrop);
            monton.addEventListener('dragenter', handleDragEnter);
            monton.addEventListener('dragleave', handleDragLeave);
        } else {
            // Deshabilitar drag & drop
            monton.setAttribute('draggable', 'false');
            monton.classList.remove('draggable');
            
            // Remover event listeners
            monton.removeEventListener('dragstart', handleDragStart);
            monton.removeEventListener('dragend', handleDragEnd);
            monton.removeEventListener('dragover', handleDragOver);
            monton.removeEventListener('drop', handleDrop);
            monton.removeEventListener('dragenter', handleDragEnter);
            monton.removeEventListener('dragleave', handleDragLeave);
        }
    });
}

// Funciones de drag & drop
function handleDragStart(e) {
    if (!juegoEnCurso || estadoJuego.estado !== 'jugando') {
        e.preventDefault();
        return;
    }
    
    cartaArrastrada = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    cartaArrastrada = null;
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (cartaArrastrada && cartaArrastrada !== this) {
        this.classList.add('drop-zone');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drop-zone');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    this.classList.remove('drop-zone');
    
    if (cartaArrastrada && cartaArrastrada !== this) {
        // Verificar si es una jugada válida
        const montonOrigenId = parseInt(cartaArrastrada.id.split('-')[1]);
        const montonDestinoId = parseInt(this.id.split('-')[1]);
        
        if (montonOrigenId === estadoJuego.montonActual) {
            // Hacer la jugada
            hacerJugada(montonOrigenId);
        } else {
            mostrarMensaje(`⚠️ Debes mover la carta del montón ${obtenerNombreCarta(estadoJuego.montonActual)}`);
        }
    }
    
    return false;
}

function configurarEventListeners() {
    btnEstablecerPregunta.addEventListener('click', establecerPregunta);
    btnBarajar.addEventListener('click', barajarCartas);
    btnRepartir.addEventListener('click', repartirCartas);
    btnNuevoJuego.addEventListener('click', nuevoJuego);
    btnModoAutomatico.addEventListener('click', () => cambiarModo(false));
    btnModoManual.addEventListener('click', () => cambiarModo(true));
    
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
        
        // Iniciar cronómetro cuando comience el juego
        iniciarCronometro();
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
    
    // En modo manual, solo permitir drag & drop, no clicks
    if (modoManual) {
        mostrarMensaje('🖱️ En modo manual, arrastra las cartas a su posición correcta.');
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
            pararCronometro();
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
        
        // Resetear cronómetro y puntuación
        pararCronometro();
        puntuacion = 0;
        tiempoInicio = null;
        inicializarCronometro();
        
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

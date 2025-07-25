// ===== FUNCIÓN SIMPLE PARA EL BOTÓN =====
function comenzarJuegoSimple() {
    console.log('🎮 comenzarJuegoSimple ejecutada');
    
    // Ocultar pantalla inicio
    const pantallaInicio = document.getElementById('pantalla-inicio');
    if (pantallaInicio) {
        pantallaInicio.classList.remove('activa');
    }
    
    // Mostrar pantalla modo
    const pantallaModo = document.getElementById('pantalla-modo');
    if (pantallaModo) {
        pantallaModo.classList.add('activa');
        console.log('✅ Pantalla cambiada exitosamente');
    } else {
        console.error('❌ No se encontró pantalla-modo');
    }
}

// ===== VARIABLES GLOBALES =====
let modoJuego = '';
let pregunta = '';

// ===== MANEJO DE PANTALLAS =====
function mostrarPantalla(pantallaId) {
    console.log('📱 Cambiando a pantalla:', pantallaId);
    
    // Ocultar todas las pantallas
    const pantallas = document.querySelectorAll('.pantalla');
    pantallas.forEach(pantalla => {
        pantalla.classList.remove('activa');
    });
    
    // Mostrar la pantalla seleccionada
    const pantallaObjetivo = document.getElementById(pantallaId);
    if (pantallaObjetivo) {
        pantallaObjetivo.classList.add('activa');
        console.log('✅ Pantalla mostrada:', pantallaId);
    } else {
        console.error('❌ No se encontró la pantalla:', pantallaId);
    }
}

// ===== NAVEGACIÓN =====
function comenzarJuego() {
    console.log('🎮 Función comenzarJuego ejecutada');
    try {
        mostrarPantalla('pantalla-modo');
        console.log('✅ Navegación exitosa a pantalla-modo');
    } catch (error) {
        console.error('❌ Error en comenzarJuego:', error);
    }
}

function seleccionarModo(modo) {
    modoJuego = modo;
    // Mostrar pantalla para ingresar la pregunta antes de iniciar el juego
    mostrarPantalla('pantalla-pregunta');
    // Limpiar input y enfocar
    setTimeout(() => {
        const input = document.getElementById('input-pregunta');
        if (input) {
            input.value = '';
            input.focus();
        }
        actualizarContador && actualizarContador();
    }, 100);
    // Cambiar texto de ayuda según el modo
    const ayuda = document.getElementById('ayuda-pregunta');
    if (ayuda) {
        ayuda.textContent = modo === 'automatico'
            ? 'Modo automático: Escribe tu pregunta y deja que el oráculo decida.'
            : 'Modo manual: Escribe tu pregunta y juega para descubrir la respuesta.';
    }
    // Botón para continuar
    const btnIniciar = document.getElementById('btn-iniciar-juego');
    if (btnIniciar) {
        btnIniciar.onclick = function(e) {
            e.preventDefault();
            irAJuego();
        };
    }

    // Actualizar contador de caracteres en tiempo real
    const inputPregunta = document.getElementById('input-pregunta');
    if (inputPregunta) {
        inputPregunta.removeEventListener && inputPregunta.removeEventListener('input', actualizarContador);
        inputPregunta.addEventListener('input', actualizarContador);
        // Actualizar contador al cargar
        actualizarContador();
    }
}

function irAJuego() {
    pregunta = document.getElementById('input-pregunta').value.trim();
    
    if (pregunta.length === 0) {
        alert('Por favor escribe una pregunta antes de continuar.');
        return;
    }
    
    iniciarJuego();
}

function iniciarJuego() {
    // Mostrar pregunta en pantalla de juego
    document.getElementById('pregunta-mostrada').textContent = pregunta;

    // Mostrar modo activo
    const modoIndicador = document.getElementById('modo-indicador');
    if (modoIndicador) {
        modoIndicador.textContent = modoJuego === 'automatico'
            ? '🤖 MODO AUTOMÁTICO'
            : '🎮 MODO MANUAL - Haz clic en las cartas';
        modoIndicador.className = `modo-indicador ${modoJuego}`;
    }
    // Eliminar por completo el texto de ayuda de barajar/repartir si existe
    const ayudaJuego = document.getElementById('ayuda-juego');
    if (ayudaJuego) {
        ayudaJuego.innerHTML = '';
        ayudaJuego.style.display = 'none';
    }

    // Cambiar a pantalla de juego
    mostrarPantalla('pantalla-juego');

    // Inicializar el juego
    inicializarJuego();

    // No barajar ni repartir automáticamente
    // Mostrar el oso polar desenfocado en el área de juego desde el inicio
    const areaJuego = document.getElementById('area-juego');
    if (areaJuego) {
        areaJuego.innerHTML = '';
        // Eliminar cualquier oso previo
        let contOso = document.getElementById('contenedor-oso');
        if (contOso) contOso.remove();
        // Crear contenedor para el oso (lado izquierdo)
        contOso = document.createElement('div');
        contOso.id = 'contenedor-oso';
        contOso.style.position = 'absolute';
        contOso.style.left = '0';
        contOso.style.top = '0';
        contOso.style.width = '50%';
        contOso.style.height = '100%';
        contOso.style.display = 'flex';
        contOso.style.alignItems = 'center';
        contOso.style.justifyContent = 'center';
        contOso.style.pointerEvents = 'none';
        contOso.style.zIndex = '1';
        // Imagen del oso grande y centrada, con desenfoque fuerte
        let oso = document.createElement('img');
        oso.id = 'oso-mesa';
        oso.src = './static/oso-polar.png';
        oso.alt = 'Oso polar decorativo';
        oso.style.position = 'absolute';
        oso.style.left = '50%';
        oso.style.top = '50%';
        oso.style.transform = 'translate(-50%, -50%)';
        oso.style.width = '420px';
        oso.style.height = '420px';
        oso.style.opacity = '0.85';
        oso.style.filter = 'blur(8px) saturate(1.1)';
        oso.style.pointerEvents = 'none';
        oso.style.zIndex = '1';
        contOso.appendChild(oso);
        areaJuego.appendChild(contOso);
    }
    // Habilitar solo el botón de barajar y asegurar que el de repartir está bien
    const btnRepartir = document.getElementById('btnRepartir');
    const btnBarajar = document.getElementById('btnBarajar');
    if (btnRepartir) {
        btnRepartir.disabled = true;
        // Eliminar listeners previos para evitar duplicados
        btnRepartir.onclick = null;
        btnRepartir.removeEventListener && btnRepartir.removeEventListener('click', repartirCartas);
        btnRepartir.addEventListener('click', repartirCartas);
    }
    if (btnBarajar) btnBarajar.disabled = false;
}

// ===== INTERACTIVIDAD DEL MODO MANUAL =====
let cartaSeleccionada = null;

function seleccionarCartaDeMonton(event) {
    const carta = event.currentTarget;
    
    // Solo se pueden seleccionar las cartas de arriba (visibles)
    if (carta.dataset.posicionEnMonton !== '3') {
        return;
    }
    
    // Si ya hay una carta seleccionada
    if (cartaSeleccionada) {
        // Si clickeamos la misma carta, la deseleccionamos
        if (cartaSeleccionada === carta) {
            deseleccionarCarta();
            return;
        }
        
        // Si clickeamos otra carta, intentamos intercambiar montones
        intercambiarMontones(cartaSeleccionada, carta);
        deseleccionarCarta();
    } else {
        // Seleccionar la carta
        cartaSeleccionada = carta;
        carta.classList.add('seleccionada');
        
        // Resaltar todo el montón
        const monton = carta.dataset.monton;
        document.querySelectorAll(`[data-monton="${monton}"]`).forEach(c => {
            c.classList.add('monton-seleccionado');
        });
        
        puntuacion += 5; // Puntos por selección
        actualizarPuntuacion();
    }
}

function deseleccionarCarta() {
    if (cartaSeleccionada) {
        cartaSeleccionada.classList.remove('seleccionada');
        
        // Quitar cualquier resaltado de montón (por compatibilidad)
        document.querySelectorAll('.monton-seleccionado').forEach(c => {
            c.classList.remove('monton-seleccionado');
        });
        
        cartaSeleccionada = null;
    }
}

function intercambiarMontones(carta1, carta2) {
    const monton1 = carta1.dataset.monton;
    const monton2 = carta2.dataset.monton;
    
    if (monton1 === monton2) return; // No intercambiar el mismo montón
    
    // Obtener todas las cartas de cada montón
    const cartasMonton1 = document.querySelectorAll(`[data-monton="${monton1}"]`);
    const cartasMonton2 = document.querySelectorAll(`[data-monton="${monton2}"]`);
    
    // Obtener posiciones base
    const pos1 = {
        top: parseInt(cartasMonton1[0].style.top),
        left: parseInt(cartasMonton1[0].style.left)
    };
    const pos2 = {
        top: parseInt(cartasMonton2[0].style.top),
        left: parseInt(cartasMonton2[0].style.left)
    };
    
    // Intercambiar posiciones de todos los montones
    cartasMonton1.forEach((carta, index) => {
        carta.style.transition = 'all 0.5s ease';
        carta.style.top = (pos2.top + (index * 2)) + 'px';
        carta.style.left = (pos2.left + (index * 1)) + 'px';
        carta.dataset.monton = monton2;
    });
    
    cartasMonton2.forEach((carta, index) => {
        carta.style.transition = 'all 0.5s ease';
        carta.style.top = (pos1.top + (index * 2)) + 'px';
        carta.style.left = (pos1.left + (index * 1)) + 'px';
        carta.dataset.monton = monton1;
    });
    
    // Intercambiar etiquetas
    const etiqueta1 = document.querySelector('.etiqueta-monton');
    const etiquetas = document.querySelectorAll('.etiqueta-monton');
    etiquetas.forEach(etiqueta => {
        if (etiqueta.textContent === monton1) {
            etiqueta.style.top = (pos2.top - 25) + 'px';
            etiqueta.style.left = (pos2.left + 25) + 'px';
        } else if (etiqueta.textContent === monton2) {
            etiqueta.style.top = (pos1.top - 25) + 'px';
            etiqueta.style.left = (pos1.left + 25) + 'px';
        }
    });
    
    // Agregar puntos por movimiento
    puntuacion += 20;
    actualizarPuntuacion();
    
    mostrarMensaje(`¡Montones ${monton1} y ${monton2} intercambiados! +20 puntos`);
}

function seleccionarCarta(event) {
    if (modoJuego !== 'manual') return;
    
    const carta = event.currentTarget;
    
    // Si ya hay una carta seleccionada
    if (cartaSeleccionada) {
        // Si clickeamos la misma carta, la deseleccionamos
        if (cartaSeleccionada === carta) {
            deseleccionarCarta();
            return;
        }
        
        // Si clickeamos otra carta, intentamos intercambiar
        intercambiarCartas(cartaSeleccionada, carta);
        deseleccionarCarta();
    } else {
        // Seleccionar la carta
        cartaSeleccionada = carta;
        carta.classList.add('seleccionada');
        
        puntuacion += 5; // Puntos por selección
        actualizarPuntuacion();
    }
}

function intercambiarCartas(carta1, carta2) {
    // Obtener posiciones
    const pos1 = {
        left: parseInt(carta1.style.left),
        top: parseInt(carta1.style.top)
    };
    const pos2 = {
        left: parseInt(carta2.style.left),
        top: parseInt(carta2.style.top)
    };
    
    // Intercambiar posiciones con animación
    carta1.style.transition = 'all 0.5s ease';
    carta2.style.transition = 'all 0.5s ease';
    
    carta1.style.left = pos2.left + 'px';
    carta1.style.top = pos2.top + 'px';
    
    carta2.style.left = pos1.left + 'px';
    carta2.style.top = pos1.top + 'px';
    
    // Intercambiar datos de posición
    const tempFila = carta1.dataset.fila;
    const tempColumna = carta1.dataset.columna;
    
    carta1.dataset.fila = carta2.dataset.fila;
    carta1.dataset.columna = carta2.dataset.columna;
    
    carta2.dataset.fila = tempFila;
    carta2.dataset.columna = tempColumna;
    
    // Agregar puntos por movimiento
    puntuacion += 20;
    actualizarPuntuacion();
    
    const valor1 = carta1.dataset.valor;
    const valor2 = carta2.dataset.valor;
    mostrarMensaje(`¡Cartas ${valor1} y ${valor2} intercambiadas! +20 puntos`);
}

function getValorNumerico(valor) {
    if (valor === 'A') return 1;
    if (valor === 'J') return 11;
    if (valor === 'Q') return 12;
    if (valor === 'K') return 13;
    return parseInt(valor);
}

function mostrarMensaje(mensaje) {
    // Crear elemento de mensaje temporal
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje-temporal';
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: fadeInOut 2s ease-in-out;
    `;
    
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        document.body.removeChild(mensajeDiv);
    }, 2000);
}
function usarEjemplo(texto) {
    document.getElementById('input-pregunta').value = texto;
    actualizarContador();
}

function actualizarContador() {
    const input = document.getElementById('input-pregunta');
    const contador = document.querySelector('.contador-caracteres');
    if (contador) {
        contador.textContent = `${input.value.length}/200`;
    }
}

// ===== BOTONES DE JUEGO =====
function volverAInicio() {
    // Ocultar todas las pantallas y mostrar solo la de inicio
    const pantallas = document.querySelectorAll('.pantalla');
    pantallas.forEach(p => p.classList.remove('activa'));
    const pantallaInicio = document.getElementById('pantalla-inicio');
    if (pantallaInicio) pantallaInicio.classList.add('activa');

    // Limpiar área de juego y mensajes
    const areaJuego = document.getElementById('area-juego');
    if (areaJuego) areaJuego.innerHTML = '';
    const mensajes = document.getElementById('mensajes');
    if (mensajes) mensajes.innerHTML = '';

    // Restaurar estado de botones
    const btnRepartir = document.getElementById('btnRepartir');
    const btnNuevo = document.getElementById('btnNuevoJuego');
    const btnBarajar = document.getElementById('btnBarajar');
    if (btnRepartir) btnRepartir.disabled = true;
    if (btnNuevo) btnNuevo.disabled = true;
    if (btnBarajar) btnBarajar.disabled = false;

    // Reiniciar variables globales
    modoJuego = '';
    pregunta = '';
    cartas = [];
    barajadas = false;
    repartidas = false;
    puntuacion = 0;
    startTime = null;
    actualizarPuntuacion();

    // Limpiar input de pregunta
    const inputPregunta = document.getElementById('input-pregunta');
    if (inputPregunta) {
        inputPregunta.value = '';
        actualizarContador();
    }
}

// ===== LÓGICA ORIGINAL DEL JUEGO =====
let cartas = [];
let barajadas = false;
let repartidas = false;
let startTime = null;
let puntuacion = 0;

function inicializarJuego() {
    crearCartas();
    startTime = Date.now();
    puntuacion = 0;
    actualizarCronometro();
    actualizarPuntuacion();
}

function actualizarPuntuacion() {
    const elementoPuntuacion = document.getElementById('puntuacion');
    if (elementoPuntuacion) {
        elementoPuntuacion.textContent = puntuacion.toString().padStart(3, '0');
    }
}

function crearCartas() {
    const palos = ['♠', '♥', '♦', '♣'];
    const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    cartas = [];
    
    palos.forEach(palo => {
        valores.forEach(valor => {
            cartas.push({ valor, palo });
        });
    });
}


function barajar() {
    // Animación visual de riffle shuffle (mazo partido en dos, izquierda y derecha, pero ahora a la izquierda)
    const areaJuego = document.getElementById('area-juego');
    if (!areaJuego) return;
    areaJuego.innerHTML = '';

    // Eliminar decorativo central (línea café)
    // Dividir el área de juego en dos mitades: izquierda (oso) y derecha (cartas)
    // Limpiar cualquier layout anterior
    let contOso = document.getElementById('contenedor-oso');
    if (contOso) contOso.remove();
    let contCartas = document.getElementById('contenedor-cartas');
    if (contCartas) contCartas.remove();

    // Crear contenedor para el oso (lado izquierdo)
    contOso = document.createElement('div');
    contOso.id = 'contenedor-oso';
    contOso.style.position = 'absolute';
    contOso.style.left = '0';
    contOso.style.top = '0';
    contOso.style.width = '50%';
    contOso.style.height = '100%';
    contOso.style.display = 'flex';
    contOso.style.alignItems = 'center';
    contOso.style.justifyContent = 'center';
    contOso.style.pointerEvents = 'none';
    contOso.style.zIndex = '1';
    // Imagen del oso grande y centrada, con desenfoque leve
    let oso = document.createElement('img');
    oso.id = 'oso-mesa';
    oso.src = './static/oso-polar.png';
    oso.alt = 'Oso polar decorativo';
    oso.style.position = 'absolute';
    oso.style.left = '50%';
    oso.style.top = '50%';
    oso.style.transform = 'translate(-50%, -50%)';
    oso.style.width = '420px';
    oso.style.height = '420px';
    oso.style.opacity = '0.85';
    oso.style.filter = 'blur(8px) saturate(1.1)';
    oso.style.pointerEvents = 'none';
    oso.style.zIndex = '1';
    contOso.appendChild(oso);
    areaJuego.appendChild(contOso);

    // Crear contenedor para las cartas (lado derecho)
    contCartas = document.createElement('div');
    contCartas.id = 'contenedor-cartas';
    contCartas.style.position = 'absolute';
    contCartas.style.left = '50%';
    contCartas.style.top = '0';
    contCartas.style.width = '50%';
    contCartas.style.height = '100%';
    contCartas.style.zIndex = '2';
    contCartas.style.pointerEvents = 'auto';
    areaJuego.appendChild(contCartas);

    // ...el resto del código sigue igual, pero ajusta las posiciones X de cartas...

    let cartasTemp = [];
    const anchoCartas = contCartas.offsetWidth || (areaJuego.offsetWidth / 2);
    const altoCartas = contCartas.offsetHeight || areaJuego.offsetHeight;
    // Pilas separadas a los extremos izquierdo y derecho del área de cartas
    const margenLateral = Math.max(20, anchoCartas * 0.04);
    const posMazoIzqX = margenLateral;
    const posMazoDerX = anchoCartas - margenLateral - 70;
    const posMazoY = (altoCartas / 2) - 100;
    // Primera mitad a la izquierda del área de cartas
    for (let i = 0; i < 26; i++) {
        const cartaDiv = document.createElement('div');
        cartaDiv.className = 'carta carta-boca-abajo anim-shuffle';
        cartaDiv.style.position = 'absolute';
        cartaDiv.style.left = posMazoIzqX + 'px';
        cartaDiv.style.top = (posMazoY - i * 2) + 'px';
        cartaDiv.style.zIndex = i;
        cartaDiv.style.transition = 'all 0.4s cubic-bezier(.4,2,.6,1)';
        cartaDiv.innerHTML = `
            <div class="carta-reverso">
                <div class="patron-reverso"></div>
            </div>
        `;
        contCartas.appendChild(cartaDiv);
        cartasTemp.push(cartaDiv);
    }
    // Segunda mitad a la derecha del área de cartas
    for (let i = 26; i < 52; i++) {
        const cartaDiv = document.createElement('div');
        cartaDiv.className = 'carta carta-boca-abajo anim-shuffle';
        cartaDiv.style.position = 'absolute';
        cartaDiv.style.left = posMazoDerX + 'px';
        cartaDiv.style.top = (posMazoY - (i-26) * 2) + 'px';
        cartaDiv.style.zIndex = i;
        cartaDiv.style.transition = 'all 0.4s cubic-bezier(.4,2,.6,1)';
        cartaDiv.innerHTML = `
            <div class="carta-reverso">
                <div class="patron-reverso"></div>
            </div>
        `;
        contCartas.appendChild(cartaDiv);
        cartasTemp.push(cartaDiv);
    }

    // Animar el riffle shuffle visual (alternar cartas de cada pila al centro)
    setTimeout(() => {
        let left = cartasTemp.slice(0, 26);
        let right = cartasTemp.slice(26);
        let ordenAnim = [];
        let l = 0, r = 0;
        while (l < left.length || r < right.length) {
            let takeLeft = Math.random() < 0.5;
            let n = Math.floor(Math.random() * 2) + 1;
            for (let j = 0; j < n; j++) {
                if (takeLeft && l < left.length) {
                    ordenAnim.push(left[l]);
                    l++;
                } else if (r < right.length) {
                    ordenAnim.push(right[r]);
                    r++;
                } else if (l < left.length) {
                    ordenAnim.push(left[l]);
                    l++;
                }
            }
        }
        // Animar cartas "cayendo" a una pila apilada en el centro de la mesa
        const pilaX = (anchoCartas / 2) - 35;
        const pilaY = (altoCartas / 2) - 50;
        ordenAnim.forEach((cartaDiv, idx) => {
            setTimeout(() => {
                cartaDiv.style.left = pilaX + 'px';
                cartaDiv.style.top = (pilaY + idx * 2) + 'px';
                cartaDiv.style.zIndex = 100 + idx;
            }, 80 * idx);
        });

        // Al terminar la animación, hacer el shuffle lógico y dejar el mazo apilado en el centro
        setTimeout(() => {
            // Barajado tipo riffle shuffle (lógico)
            function riffleShuffle(array) {
                let mid = Math.floor(array.length / 2 + (Math.random() * 5 - 2));
                let left = array.slice(0, mid);
                let right = array.slice(mid);
                let result = [];
                while (left.length > 0 || right.length > 0) {
                    let takeLeft = Math.random() < 0.5;
                    let n = Math.floor(Math.random() * 3) + 1;
                    if (takeLeft && left.length > 0) {
                        result = result.concat(left.splice(0, n));
                    } else if (right.length > 0) {
                        result = result.concat(right.splice(0, n));
                    } else if (left.length > 0) {
                        result = result.concat(left.splice(0, n));
                    }
                }
                return result;
            }
            for (let veces = 0; veces < 5; veces++) {
                cartas = riffleShuffle(cartas);
            }
            barajadas = true;
            const btnRepartir = document.getElementById('btnRepartir');
            const btnBarajar = document.getElementById('btnBarajar');
            if (btnRepartir) {
                btnRepartir.disabled = false;
                btnRepartir.onclick = null;
                btnRepartir.removeEventListener && btnRepartir.removeEventListener('click', repartirCartas);
                btnRepartir.addEventListener('click', repartirCartas);
            }
            if (btnBarajar) btnBarajar.disabled = true;
            // Dejar el mazo apilado en el centro
            setTimeout(() => {
                // Limpiar solo cartas
                contCartas.innerHTML = '';
                for (let i = 0; i < cartas.length; i++) {
                    const cartaDiv = document.createElement('div');
                    cartaDiv.className = 'carta carta-boca-abajo';
                    cartaDiv.style.position = 'absolute';
                    cartaDiv.style.left = pilaX + 'px';
                    cartaDiv.style.top = (pilaY - i * 2) + 'px';
                    cartaDiv.style.zIndex = 100 + i;
                    cartaDiv.innerHTML = `
                        <div class="carta-reverso">
                            <div class="patron-reverso"></div>
                        </div>
                    `;
                    contCartas.appendChild(cartaDiv);
                }
            }, 600);
        }, 80 * ordenAnim.length + 400);
    }, 1100);
}


// ===== MODO AUTOMÁTICO: VOLTEAR Y COLOCAR CARTA POR CLIC =====

// --- NUEVA LÓGICA DE MONTÓN ACTIVO Y MOVIMIENTO AUTOMÁTICO ---
function repartirCartas() {
    // Mejorar la validación: si la pregunta menciona explícitamente el valor de algún montón y ese es el primer montón completado, la respuesta es SÍ
    function obtenerRespuestaPorPregunta(primerMontonCompleto, pregunta) {
        if (!pregunta || !primerMontonCompleto) return 'NO';
        // Valores posibles (A, 2, ..., 10, J, Q, K)
        const valoresMonton = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
        // Buscar si la pregunta menciona explícitamente el valor
        let valorPregunta = null;
        for (let valor of valoresMonton) {
            // Buscar coincidencia exacta (mayúsculas/minúsculas, número o letra)
            let regex = new RegExp(`\\b${valor}\\b`, 'i');
            if (regex.test(pregunta)) {
                valorPregunta = valor;
                break;
            }
            // Para letras, también buscar palabras como "as", "jota", "reina", "rey"
            if (valor === 'A' && /\b(as|ace)\b/i.test(pregunta)) valorPregunta = 'A';
            if (valor === 'J' && /\b(jota|jack)\b/i.test(pregunta)) valorPregunta = 'J';
            if (valor === 'Q' && /\b(reina|queen)\b/i.test(pregunta)) valorPregunta = 'Q';
            if (valor === 'K' && /\b(rey|king|centro)\b/i.test(pregunta)) valorPregunta = 'K';
            if (valorPregunta) break;
        }
        if (!valorPregunta) return 'NO';
        return (primerMontonCompleto === valorPregunta) ? 'SÍ' : 'NO';
    }
    if (!barajadas) {
        alert('Primero debes barajar las cartas');
        return;
    }
    const areaJuego = document.getElementById('area-juego');
    
    // Preservar el contenedor del oso antes de limpiar
    const contOso = document.getElementById('contenedor-oso');
    let osoHTML = '';
    if (contOso) {
        osoHTML = contOso.outerHTML;
    }
    
    areaJuego.innerHTML = '';
    
    // Restaurar el contenedor del oso
    if (osoHTML) {
        areaJuego.innerHTML = osoHTML;
    }
    
    // Mostrar el mazo barajado en el centro antes de repartir
    const anchoPantalla = areaJuego ? areaJuego.offsetWidth : window.innerWidth;
    const altoPantalla = areaJuego ? areaJuego.offsetHeight : window.innerHeight;
    const posMazoCentroX = (anchoPantalla / 2) - 35;
    const posMazoY = (altoPantalla / 2) - 50;
    let mazoDivs = [];
    for (let i = 0; i < cartas.length; i++) {
        const cartaDiv = document.createElement('div');
        cartaDiv.className = 'carta carta-boca-abajo anim-shuffle';
        cartaDiv.style.position = 'absolute';
        cartaDiv.style.left = posMazoCentroX + 'px';
        cartaDiv.style.top = (posMazoY - i * 2) + 'px';
        cartaDiv.style.zIndex = i;
        cartaDiv.style.transition = 'all 0.4s cubic-bezier(.4,2,.6,1)';
        cartaDiv.innerHTML = `
            <div class="carta-reverso">
                <div class="patron-reverso"></div>
            </div>
        `;
        areaJuego.appendChild(cartaDiv);
        mazoDivs.push(cartaDiv);
    }

    // Definir posiciones del marco (12 posiciones alrededor del centro 2x2)
    // Ajustar para que el tablero ocupe todo el ancho, desde el borde izquierdo al derecho
    const sepX = Math.max(90, (anchoPantalla - 120) / 3); // 120px de margen total
    const sepY = 100;
    // El tablero mide 4*sepX (ancho) y 4*sepY (alto)
    const tableroAncho = 4 * sepX;
    const tableroAlto = 4 * sepY;
    // El tablero inicia a 60px del borde izquierdo
    const baseX = 60;
    const baseY = Math.max(0, Math.round((altoPantalla - tableroAlto) / 2));
    const marco = [
        [0,0],[0,1],[0,2],[0,3],
        [1,3],[2,3],
        [3,3],[3,2],[3,1],[3,0],
        [2,0],[1,0]
    ];
    // Centro exacto del tablero
    const centroMazoX = baseX + 2 * sepX - 35;
    const centroMazoY = baseY + 1.5 * sepY;


    // Crear una lista de montones para cada valor (A,2,...,Q,K), cada uno con 4 cartas
    const valoresMonton = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    let montones = Array.from({length: 13}, () => []); // 13 montones (A-K)
    // Posiciones visuales para cada montón
    let posicionesMonton = [];
    for (let i = 0; i < 12; i++) {
        let [fila, col] = marco[i];
        posicionesMonton.push({
            x: baseX + col * sepX,
            y: baseY + fila * sepY,
            valor: valoresMonton[i]
        });
    }
    // Centro (K)
    posicionesMonton.push({
        x: baseX + 1.5 * sepX,
        y: baseY + 1.5 * sepY,
        valor: 'K'
    });

    // Repartir 4 cartas a cada montón de forma secuencial (como el barajado original)
    let cartasARepartir = cartas.slice();
    let cartasDivs = [];
    let cartaIdx = 0;
    for (let m = 0; m < 13; m++) {
        for (let j = 0; j < 4; j++) {
            const carta = cartasARepartir[cartaIdx++];
            const cartaDiv = document.createElement('div');
            cartaDiv.className = 'carta carta-boca-abajo';
            cartaDiv.dataset.valor = carta.valor;
            cartaDiv.dataset.palo = carta.palo;
            cartaDiv.style.position = 'absolute';
            // Animar desde el mazo central
            cartaDiv.style.left = posMazoCentroX + 'px';
            cartaDiv.style.top = (posMazoY - cartaIdx * 2) + 'px';
            cartaDiv.style.zIndex = 200 + cartaIdx;
            cartaDiv.style.opacity = '1';
            cartaDiv.innerHTML = `
                <div class="carta-reverso">
                    <div class="patron-reverso"></div>
                </div>
            `;
            areaJuego.appendChild(cartaDiv);
            montones[m].push(cartaDiv);
            cartasDivs.push(cartaDiv);
        }
    }

    // Posicionar visualmente cada carta en su montón
    let animaciones = [];
    for (let m = 0; m < montones.length; m++) {
        let pos = posicionesMonton[m];
        for (let j = 0; j < montones[m].length; j++) {
            let cartaDiv = montones[m][j];
            cartaDiv.dataset.monton = m === 12 ? 'centro' : m; // 12 es K (centro)
            cartaDiv.dataset.posicion = j;
            cartaDiv.dataset.destX = (pos.x + j * 3);
            cartaDiv.dataset.destY = (pos.y - j * 8);
            cartaDiv.dataset.destZ = 1 + j;
            animaciones.push({
                cartaDiv,
                destX: cartaDiv.dataset.destX,
                destY: cartaDiv.dataset.destY,
                destZ: cartaDiv.dataset.destZ
            });
        }
    }

    // Animar el reparto
    function animarReparto(i) {
        if (i >= animaciones.length) {
            repartidas = true;
            const btnNuevo = document.getElementById('btnNuevoJuego');
            if (btnNuevo) btnNuevo.disabled = false;
            // Al inicio, solo la carta superior del montón 0 (A) está habilitada
            for (let m = 0; m < montones.length; m++) {
                let cartasMonton = montones[m];
                cartasMonton.forEach(c => c.onclick = null);
            }
            if (montones[0].length > 0) {
                let cartaSuperior = montones[0][montones[0].length - 1];
                if (!cartaSuperior.classList.contains('carta-boca-arriba')) {
                    cartaSuperior.onclick = function() {
                        voltearCarta(cartaSuperior, 0, montones);
                    };
                }
            }
            return;
        }
        const {cartaDiv, destX, destY, destZ} = animaciones[i];
        cartaDiv.style.transition = 'none';
        cartaDiv.style.opacity = '1';
        setTimeout(() => {
            cartaDiv.style.transition = 'all 0.6s cubic-bezier(.4,2,.6,1)';
            cartaDiv.style.left = destX + 'px';
            cartaDiv.style.top = destY + 'px';
            cartaDiv.style.zIndex = destZ;
            cartaDiv.style.transform = 'scale(1) rotateY(0deg)';
            setTimeout(() => {
                animarReparto(i + 1);
            }, 80);
        }, 40);
    }
    animarReparto(0);

    // ====== LÓGICA DE VALIDACIÓN DE PREGUNTA ======
    let primerMontonCompleto = null; // Guardar cuál montón se completa primero
    // Función para voltear la carta y moverla a su montón correspondiente
    function voltearCarta(cartaDiv, m, montones) {
        if (cartaDiv.classList.contains('carta-boca-arriba')) return;
        cartaDiv.classList.remove('carta-boca-abajo');
        cartaDiv.classList.add('carta-boca-arriba');
        cartaDiv.innerHTML = `
            <div class="carta-frente">
                <span class="valor">${cartaDiv.dataset.valor}</span>
                <span class="palo">${cartaDiv.dataset.palo}</span>
            </div>
        `;
        cartaDiv.onclick = null;

        setTimeout(() => {
            // Determinar el montón destino según el valor de la carta
            const valoresMonton = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
            let idxDestino = valoresMonton.indexOf(cartaDiv.dataset.valor);
            let posDestino = posicionesMonton[idxDestino];
            // Quitar la carta del montón actual
            montones[m].pop();
            // Agregar la carta al fondo del montón destino (INICIO del array)
            montones[idxDestino].unshift(cartaDiv);

            // 1. Animar la carta al frente (z-index alto, arriba de todas)
            cartaDiv.style.transition = 'all 0.8s cubic-bezier(.4,2,.6,1)';
            cartaDiv.style.left = (posDestino.x) + 'px';
            cartaDiv.style.top = (posDestino.y - 40) + 'px'; // un poco más arriba
            cartaDiv.style.zIndex = 9999;

            // 2. Después de un tiempo, bajarla a la posición final y z-index bajo (más lento)
            setTimeout(() => {
                cartaDiv.style.transition = 'all 0.8s cubic-bezier(.4,2,.6,1)';
                cartaDiv.style.top = (posDestino.y) + 'px';
                cartaDiv.style.zIndex = 1;
                // 3. Reordenar en el DOM para que quede detrás visualmente
                if (cartaDiv.parentNode) {
                    // Insertar justo antes de la primera carta boca arriba (si existe), para que quede "detrás" pero visible
                    let parent = cartaDiv.parentNode;
                    let next = null;
                    for (let i = 0; i < parent.children.length; i++) {
                        if (parent.children[i] !== cartaDiv && parent.children[i].classList.contains('carta-boca-arriba')) {
                            next = parent.children[i];
                            break;
                        }
                    }
                    if (next) {
                        parent.insertBefore(cartaDiv, next);
                    } else {
                        parent.appendChild(cartaDiv);
                    }
                }
            }, 800);

            // 4. Al terminar la animación, permitir clic SOLO en la carta superior del montón destino
            setTimeout(() => {
                for (let k = 0; k < montones.length; k++) {
                    let cartasMonton = montones[k];
                    cartasMonton.forEach(c => c.onclick = null);
                }
                // Solo el montón destino habilita su carta superior
                let cartasMontonDestino = montones[idxDestino];
                if (cartasMontonDestino.length > 0) {
                    let cartaSuperior = cartasMontonDestino[cartasMontonDestino.length - 1];
                    if (!cartaSuperior.classList.contains('carta-boca-arriba')) {
                        cartaSuperior.onclick = function() {
                            voltearCarta(cartaSuperior, idxDestino, montones);
                        };
                    }
                }
                // Checar si el montón destino tiene 4 cartas boca arriba
                let cartasBocaArriba = montones[idxDestino].filter(c => c.classList.contains('carta-boca-arriba'));
                if (cartasBocaArriba.length === 4) {
                    mostrarMensaje('¡Completaste las 4 cartas de ' + valoresMonton[idxDestino] + '!');
                    mostrarAnimacionVictoria();
                    // Guardar el primer montón completado
                    if (primerMontonCompleto === null) {
                        primerMontonCompleto = valoresMonton[idxDestino];
                    }
                }
                // Checar si falta una carta para completar las 4 (mostrar mensaje si hay 3)
                if (cartasBocaArriba.length === 3) {
                    mostrarMensaje('¡Falta una carta para completar las 4 de ' + valoresMonton[idxDestino] + '!');
                }
                // Si ya no quedan cartas boca abajo en ningún montón, mostrar fin de juego y validar pregunta
                let quedanCartas = false;
                for (let k = 0; k < montones.length; k++) {
                    let cartasMonton = montones[k];
                    if (cartasMonton.some(c => c.classList.contains('carta-boca-abajo'))) {
                        quedanCartas = true;
                        break;
                    }
                }
                if (!quedanCartas) {
                    mostrarMensaje('¡Juego terminado! No quedan más cartas para voltear.');
                    // Validar pregunta solo en modo automático
                    if (typeof modoJuego !== 'undefined' && modoJuego === 'automatico') {
                        // Si no se completó ningún montón, la respuesta es NO
                        let respuesta = obtenerRespuestaPorPregunta(primerMontonCompleto, pregunta);
                        // Si primerMontonCompleto es null, forzar respuesta NO
                        if (!primerMontonCompleto) {
                            respuesta = 'NO';
                        }
                        setTimeout(() => {
                            mostrarMensajeFinalPregunta(pregunta, respuesta);
                        }, 2000);
                    }
                }
                // NO terminar el juego automáticamente aquí, solo cuando todos los montones estén completos
            }, 1700);
        }, 400);
    }

    // Mostrar mensaje final con la pregunta y la respuesta
    function mostrarMensajeFinalPregunta(pregunta, respuesta) {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay-final-pregunta';
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.zIndex = '10001';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.innerHTML = `
            <div style="background: #fff; padding: 32px 24px; border-radius: 16px; box-shadow: 0 4px 32px #0008; max-width: 90vw; text-align: center;">
                <h2 style="margin-bottom: 16px; color: #333;">Resultado del Oráculo</h2>
                <div style="font-size: 1.1em; margin-bottom: 12px; color: #222;">${pregunta ? pregunta : ''}</div>
                <div style="font-size: 2em; font-weight: bold; color: ${respuesta === 'SÍ' ? '#2ecc40' : '#e74c3c'}; margin-bottom: 18px;">${respuesta}</div>
                <button id="btn-cerrar-final-pregunta" style="padding: 10px 24px; font-size: 1em; border-radius: 8px; border: none; background: #4CAF50; color: #fff; cursor: pointer;">Cerrar</button>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('btn-cerrar-final-pregunta').onclick = function() {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        };
    }

    // Animación de fuegos artificiales
    function mostrarAnimacionVictoria() {
        const overlay = document.createElement('div');
        overlay.id = 'victoria-overlay';
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.zIndex = '99999';
        overlay.style.pointerEvents = 'none';
        overlay.style.background = 'rgba(0,0,0,0.0)';
        document.body.appendChild(overlay);
        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            star.className = 'estrella-victoria';
            const size = Math.random() * 12 + 8;
            star.style.position = 'absolute';
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.background = 'yellow';
            star.style.borderRadius = '50%';
            star.style.boxShadow = '0 0 8px 2px #fff, 0 0 20px 8px gold';
            star.style.left = '50vw';
            star.style.top = '50vh';
            star.style.opacity = '0.9';
            star.style.transition = 'all 1.2s cubic-bezier(.4,2,.6,1)';
            overlay.appendChild(star);
            setTimeout(() => {
                const angle = Math.random() * 2 * Math.PI;
                const radius = 200 + Math.random() * 250;
                const x = 50 + Math.cos(angle) * radius / window.innerWidth * 100;
                const y = 50 + Math.sin(angle) * radius / window.innerHeight * 100;
                star.style.left = x + 'vw';
                star.style.top = y + 'vh';
                star.style.opacity = '0';
                star.style.transform = `scale(${0.5 + Math.random() * 1.5}) rotate(${Math.random()*360}deg)`;
            }, 30);
        }
        setTimeout(() => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 1800);
    }
}

// --- LÓGICA DE MONTÓN ACTIVO Y MOVIMIENTO AUTOMÁTICO ---
function iniciarMontonActivo(centro, montones) {
    // El montón activo inicia en el centro (K)
    let montonActivo = { tipo: 'centro', idx: null };
    let montonesArr = montones;
    let centroArr = centro;

    function getTopCard(monton) {
        // Devuelve la carta superior (última) del montón
        return monton[monton.length - 1];
    }

    function getValorMonton(montonActivo) {
        if (montonActivo.tipo === 'centro') return 'K';
        return ['A','2','3','4','5','6','7','8','9','10','J','Q'][montonActivo.idx];
    }

    function activarMonton(montonActivo) {
        // Quitar resaltado de todos
        document.querySelectorAll('.carta').forEach(c => c.classList.remove('monton-activo'));
        // Resaltar la carta superior del montón activo
        let cartaSup = null;
        if (montonActivo.tipo === 'centro') {
            cartaSup = getTopCard(centroArr);
        } else {
            cartaSup = getTopCard(montonesArr[montonActivo.idx]);
        }
        if (cartaSup) cartaSup.classList.add('monton-activo');
    }

    function mostrarAnimacionVictoria(valor) {
        // Crear un overlay para la animación
        const overlay = document.createElement('div');
        overlay.id = 'victoria-overlay';
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.zIndex = '99999';
        overlay.style.pointerEvents = 'none';
        overlay.style.background = 'rgba(0,0,0,0.0)';
        document.body.appendChild(overlay);

        // Crear estrellitas explosivas
        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            star.className = 'estrella-victoria';
            const size = Math.random() * 12 + 8;
            star.style.position = 'absolute';
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.background = 'yellow';
            star.style.borderRadius = '50%';
            star.style.boxShadow = '0 0 8px 2px #fff, 0 0 20px 8px gold';
            star.style.left = '50vw';
            star.style.top = '50vh';
            star.style.opacity = '0.9';
            star.style.transition = 'all 1.2s cubic-bezier(.4,2,.6,1)';
            overlay.appendChild(star);
            // Animar a una posición aleatoria
            setTimeout(() => {
                const angle = Math.random() * 2 * Math.PI;
                const radius = 200 + Math.random() * 250;
                const x = 50 + Math.cos(angle) * radius / window.innerWidth * 100;
                const y = 50 + Math.sin(angle) * radius / window.innerHeight * 100;
                star.style.left = x + 'vw';
                star.style.top = y + 'vh';
                star.style.opacity = '0';
                star.style.transform = `scale(${0.5 + Math.random() * 1.5}) rotate(${Math.random()*360}deg)`;
            }, 30);
        }
        // Quitar overlay después de la animación
        setTimeout(() => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 1800);
    }

    // Para evitar mensajes repetidos de "falta una carta"
    if (!window._faltanMensajeMostrado) window._faltanMensajeMostrado = {};
    if (!window._explosivoMostrado) window._explosivoMostrado = {};
    function checarVictoriaYContadores() {
        // Checar todos los montones (incluyendo centro)
        let valores = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
        let completos = [];
        // Montones alrededor
        for (let i = 0; i < montonesArr.length; i++) {
            let cartasEnMonton = montonesArr[i].filter(c => c.dataset.valor === valores[i]).length;
            // Si se completa el montón y no se ha mostrado el explosivo para este valor
            if (cartasEnMonton === 4 && !window._explosivoMostrado[valores[i]]) {
                mostrarAnimacionVictoria(valores[i]);
                setTimeout(() => {
                    mostrarMensaje('¡Completaste las 4 cartas de ' + valores[i] + '!');
                }, 1000);
                window._explosivoMostrado[valores[i]] = true;
            }
            // Si baja de 4, permitir mostrar de nuevo si se vuelve a completar
            if (cartasEnMonton !== 4 && window._explosivoMostrado[valores[i]]) {
                window._explosivoMostrado[valores[i]] = false;
            }
            // Si falta solo una carta para completar
            if (cartasEnMonton === 3 && !window._faltanMensajeMostrado[valores[i]]) {
                mostrarMensaje('¡Falta una carta para completar las 4 de ' + valores[i] + '!');
                window._faltanMensajeMostrado[valores[i]] = true;
            }
            // Si ya no faltan, resetear para ese valor
            if (cartasEnMonton !== 3 && window._faltanMensajeMostrado[valores[i]]) {
                window._faltanMensajeMostrado[valores[i]] = false;
            }
        }
        // Centro (K)
        let cartasK = centroArr.filter(c => c.dataset.valor === 'K').length;
        // Aquí termina checarVictoriaYContadores
    } // <-- Cierre correcto de checarVictoriaYContadores

    // Asignar listeners solo a la carta superior de cada montón
    function actualizarListeners() {
        document.querySelectorAll('.carta').forEach(c => c.onclick = null);
        let cartaSup = null;
        if (montonActivo.tipo === 'centro') {
            cartaSup = getTopCard(centroArr);
        } else {
            cartaSup = getTopCard(montonesArr[montonActivo.idx]);
        }
        if (cartaSup) cartaSup.onclick = function() {
            clickHandler();
            setTimeout(actualizarListeners, 700); // Esperar animación
        };
    }

    // Inicializar
    activarMonton(montonActivo);
    actualizarListeners();
    checarVictoriaYContadores();

    // ====== ESTILO PARA ESTRELLAS DE VICTORIA ======
    if (!document.getElementById('estilo-estrella-victoria')) {
        const style = document.createElement('style');
        style.id = 'estilo-estrella-victoria';
        style.innerHTML = `
        .estrella-victoria {
            pointer-events: none;
            position: absolute;
            background: yellow;
            border-radius: 50%;
            box-shadow: 0 0 8px 2px #fff, 0 0 20px 8px gold;
            opacity: 0.9;
            z-index: 99999;
        }
        `;
        document.head.appendChild(style);
    }
} // <-- Cierre correcto de iniciarMontonActivo
// ...existing code...

function nuevoJuego() {
    // Quitar overlay de victoria si existe
    const overlay = document.getElementById('victoria-overlay');
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    crearCartas();
    barajadas = false;
    repartidas = false;
    puntuacion = 0;
    
    document.getElementById('area-juego').innerHTML = '';
    
    const btnRepartir = document.getElementById('btnRepartir');
    const btnNuevo = document.getElementById('btnNuevoJuego');
    const btnBarajar = document.getElementById('btnBarajar');
    if (btnRepartir) btnRepartir.disabled = true;
    if (btnNuevo) btnNuevo.disabled = true;
    if (btnBarajar) btnBarajar.disabled = false;
    
    startTime = Date.now();
    actualizarPuntuacion();
    console.log('🔄 Nuevo juego iniciado');
}

function actualizarCronometro() {
    if (startTime) {
        const tiempoTranscurrido = Math.floor((Date.now() - startTime) / 1000);
        const minutos = Math.floor(tiempoTranscurrido / 60);
        const segundos = tiempoTranscurrido % 60;
        
        const elementoCronometro = document.getElementById('cronometro');
        if (elementoCronometro) {
            elementoCronometro.textContent = 
                `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        }
    }
    
    setTimeout(actualizarCronometro, 1000);
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplicación iniciada');
    // Mostrar pantalla inicial
    mostrarPantalla('pantalla-inicio');

    // Configurar botón comenzar correctamente
    const btnComenzar = document.getElementById('btn-comenzar');
    if (btnComenzar) {
        btnComenzar.onclick = null;
        btnComenzar.removeEventListener && btnComenzar.removeEventListener('click', comenzarJuego);
        btnComenzar.removeEventListener && btnComenzar.removeEventListener('click', comenzarJuegoSimple);
        btnComenzar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 Botón comenzar clickeado');
            comenzarJuegoSimple();
        });
        console.log('✅ Event listener agregado al botón COMENZAR (comenzarJuegoSimple)');
    } else {
        console.error('❌ No se encontró el botón btn-comenzar');
    }

    // Event listeners para los botones de selección de modo
    const btnModoAutomatico = document.getElementById('btn-modo-automatico');
    const btnModoManual = document.getElementById('btn-modo-manual');
    if (btnModoAutomatico) {
        btnModoAutomatico.onclick = null;
        btnModoAutomatico.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🤖 Botón modo automático clickeado');
            seleccionarModo('automatico');
        });
    } else {
        console.error('❌ No se encontró el botón btn-modo-automatico');
    }
    if (btnModoManual) {
        btnModoManual.onclick = null;
        btnModoManual.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎮 Botón modo manual clickeado');
            seleccionarModo('manual');
        });
    } else {
        console.error('❌ No se encontró el botón btn-modo-manual');
    }

    // Event listener para el botón Barajar Cartas
    const btnBarajar = document.getElementById('btnBarajar');
    if (btnBarajar) {
        btnBarajar.onclick = null;
        btnBarajar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Botón Barajar Cartas clickeado');
            barajar();
        });
    } else {
        console.error('❌ No se encontró el botón btnBarajar');
    }

    // Event listener para el botón Nuevo Juego
    const btnNuevoJuego = document.getElementById('btnNuevoJuego');
    if (btnNuevoJuego) {
        btnNuevoJuego.onclick = null;
        btnNuevoJuego.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 Botón Nuevo Juego clickeado');
            nuevoJuego();
        });
    } else {
        console.error('❌ No se encontró el botón btnNuevoJuego');
    }

    // Event listener para el botón Volver al Inicio
    const btnVolverInicio = document.getElementById('btnVolverInicio');
    if (btnVolverInicio) {
        btnVolverInicio.onclick = null;
        btnVolverInicio.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🏠 Botón Volver al Inicio clickeado');
            volverAInicio();
        });
    } else {
        console.error('❌ No se encontró el botón btnVolverInicio');
    }
});

# 🔮 Juego de Cartas Solitario - Oráculo

Un juego de cartas interactivo desarrollado en Python con Flask que simula un oráculo que responde preguntas a través de un solitario especial.

## 🎯 Descripción del Juego

El juego consiste en un solitario donde debes ordenar todas las cartas en montones según su valor. El juego comienza colocando 4 cartas en cada uno de los 13 montones (A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K).

### 🎮 Mecánica del Juego

1. **Inicio**: Siempre se comienza por el montón del AS (A)
2. **Jugada**: Se voltea la carta superior del montón actual
3. **Colocación**: La carta volteada se coloca en el montón correspondiente a su valor
4. **Continuación**: Se continúa desde el montón donde se colocó la carta
5. **Victoria**: Se gana si todas las cartas quedan ordenadas en sus montones correctos
6. **Derrota**: Se pierde si se voltea una carta de un montón vacío

### 🔮 Funcionalidad del Oráculo

- **Pregunta**: Antes de jugar, haz una pregunta al oráculo
- **Respuesta**: Si logras ordenar todas las cartas, tu deseo se cumplirá ✨
- **Destino**: Si no logras ordenar las cartas, tu deseo no se cumplirá ❌

## 🚀 Características

- **Interfaz Gráfica**: Hermosa interfaz web con efectos visuales
- **Barajado Clásico**: Implementación de barajado realista que simula el barajado manual
- **Dos Modos de Juego**:
  - **Interactivo**: Juega tú mismo haciendo clic en los montones
  - **Automático**: Deja que el oráculo juegue automáticamente
- **Efectos Visuales**: Animaciones, partículas y efectos de hover
- **Responsive**: Funciona en dispositivos móviles y escritorio

## 📋 Requisitos

- Python 3.7+
- Flask 2.3.3
- Navegador web moderno

## 🛠️ Instalación

1. **Clona o descarga el proyecto**
2. **Instala las dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Ejecuta la aplicación**:
   ```bash
   python app.py
   ```

4. **Abre tu navegador** en: `http://localhost:5000`

## 🎯 Cómo Jugar

### Modo Interactivo
1. Escribe tu pregunta en el campo de texto
2. Haz clic en "🎮 Jugar Interactivo"
3. Haz clic en el montón resaltado para voltear la carta
4. Continúa hasta que el juego termine

### Modo Automático
1. Escribe tu pregunta en el campo de texto
2. Haz clic en "🤖 Jugar Automático"
3. Observa cómo el oráculo juega automáticamente
4. Espera el resultado de tu consulta

## 🎨 Características Técnicas

### Backend (Python/Flask)
- **Clase Carta**: Representa una carta individual con número, palo y visibilidad
- **Clase Baraja**: Maneja la creación y barajado de las 52 cartas
- **Clase JuegoSolitario**: Lógica principal del juego y validaciones
- **Barajado Clásico**: Simula el barajado manual dividiendo y mezclando

### Frontend (HTML/CSS/JavaScript)
- **Diseño Responsive**: Adaptable a diferentes tamaños de pantalla
- **Animaciones CSS**: Efectos visuales suaves y atractivos
- **JavaScript Interactivo**: Manejo de eventos y comunicación con el servidor
- **Efectos de Partículas**: Elementos visuales decorativos

### API Endpoints
- `GET /`: Página principal
- `POST /nuevo_juego`: Iniciar nuevo juego
- `POST /voltear_carta`: Voltear carta en modo interactivo
- `POST /jugar_automatico`: Jugar automáticamente
- `GET /estado_juego`: Obtener estado actual del juego

## 🎪 Estructura del Proyecto

```
JuegoCartas/
├── app.py                 # Aplicación Flask principal
├── requirements.txt       # Dependencias Python
├── README.md             # Este archivo
├── templates/
│   └── index.html        # Plantilla HTML principal
└── static/
    ├── style.css         # Estilos CSS
    └── script.js         # Lógica JavaScript
```

## 🎯 Algoritmo de Barajado

El barajado implementa una simulación realista del barajado manual:

1. **División**: La baraja se divide aproximadamente por la mitad (con variación aleatoria)
2. **Mezcla**: Se alternan grupos de 1-3 cartas de cada mitad
3. **Aleatoriedad**: Se usa randomización para simular la imperfección humana
4. **Resultado**: Una mezcla natural y realista de las cartas

## 🔧 Personalización

Puedes personalizar varios aspectos del juego:

- **Colores**: Modifica las variables CSS en `style.css`
- **Efectos**: Ajusta las animaciones y transiciones
- **Mensajes**: Cambia los textos del oráculo en `app.py`
- **Lógica**: Modifica las reglas del juego en la clase `JuegoSolitario`

## 📱 Compatibilidad

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles

## 🎉 Créditos

Desarrollado como proyecto educativo que combina:
- Programación backend con Python/Flask
- Diseño frontend con HTML/CSS/JavaScript
- Lógica de juegos de cartas
- Interfaz de usuario moderna

¡Disfruta consultando al oráculo! 🔮✨

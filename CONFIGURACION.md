# Configuración del Juego de Cartas

## Configuraciones Personalizables

### Colores del Tema
- Color primario: #667eea (azul)
- Color secundario: #764ba2 (morado)
- Color de éxito: #48bb78 (verde)
- Color de error: #f56565 (rojo)

### Configuraciones del Juego
- Número de cartas por montón: 4
- Número total de montones: 13
- Tiempo de animación: 0.3s
- Velocidad de juego automático: 800ms por jugada

### Modificaciones Sugeridas

Para cambiar la dificultad:
1. Modifica el número de cartas por montón en app.py línea 80
2. Ajusta la velocidad del juego automático en script.js línea 200

Para cambiar los colores:
1. Modifica las variables CSS en style.css líneas 20-30
2. Actualiza los gradientes en las líneas 100-150

Para personalizar mensajes:
1. Cambia los textos del oráculo en app.py líneas 150-200
2. Modifica los mensajes de la interfaz en script.js líneas 300-350

## Solución de Problemas

### El servidor no inicia
- Verifica que Python esté instalado
- Instala las dependencias: `pip install -r requirements.txt`
- Ejecuta: `python app.py`

### El juego no carga
- Verifica que el servidor esté corriendo
- Abre http://localhost:5000 en tu navegador
- Verifica que no haya errores en la consola del navegador

### Problemas de rendimiento
- Cierra otras aplicaciones pesadas
- Usa un navegador moderno (Chrome, Firefox, Edge)
- Verifica que JavaScript esté habilitado

## Expansiones Futuras

### Características Adicionales
- Múltiples mazos de cartas
- Diferentes tipos de solitario
- Sistema de puntuación
- Historial de consultas
- Múltiples idiomas
- Sonidos y música
- Modo multijugador

### Mejoras Técnicas
- Base de datos para estadísticas
- Sistema de usuarios
- API REST completa
- Versión móvil nativa
- Integración con redes sociales

"""
Juego de Cartas Solitario con Oráculo - Versión Interactiva Real
Desarrollado en Python con Flask para interfaz web
"""

from flask import Flask, render_template, request, jsonify
import random
import json

app = Flask(__name__)

class Carta:
    def __init__(self, numero, palo):
        self.numero = numero
        self.palo = palo
        self.visible = False
    
    def __str__(self):
        return f"{self.numero} de {self.palo}"
    
    def to_dict(self):
        return {
            'numero': self.numero,
            'palo': self.palo,
            'visible': self.visible
        }
    
    def valor_numerico(self):
        """Convertir carta a valor numérico para posición en montón"""
        if self.numero == 'A':
            return 1
        elif self.numero == 'J':
            return 11
        elif self.numero == 'Q':
            return 12
        elif self.numero == 'K':
            return 13
        else:
            return int(self.numero)

class Baraja:
    def __init__(self):
        self.cartas = []
        self.crear_baraja()
    
    def crear_baraja(self):
        """Crear baraja completa de 52 cartas"""
        palos = ['♥', '♦', '♣', '♠']
        numeros = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        
        for palo in palos:
            for numero in numeros:
                self.cartas.append(Carta(numero, palo))
    
    def barajar_clasico(self):
        """Recrear barajado clásico: dividir aprox por la mitad y mezclar"""
        total_cartas = len(self.cartas)
        
        # Dividir aproximadamente por la mitad (con variación random)
        mitad_base = total_cartas // 2
        variacion = random.randint(-5, 5)
        punto_corte = max(5, min(total_cartas - 5, mitad_base + variacion))
        
        # Dividir en dos mazos
        mazo1 = self.cartas[:punto_corte]
        mazo2 = self.cartas[punto_corte:]
        
        # Mezclar con drops aleatorios más realistas
        cartas_mezcladas = []
        i1, i2 = 0, 0
        
        while i1 < len(mazo1) and i2 < len(mazo2):
            # Decidir cuántas cartas tomar de cada mazo (1-4 cartas)
            drop1 = random.randint(1, min(4, len(mazo1) - i1))
            drop2 = random.randint(1, min(4, len(mazo2) - i2))
            
            # Alternar mazos con cierta probabilidad
            if random.random() < 0.6:  # 60% probabilidad de alternar
                # Tomar del mazo1 primero
                for _ in range(drop1):
                    if i1 < len(mazo1):
                        cartas_mezcladas.append(mazo1[i1])
                        i1 += 1
                
                # Luego del mazo2
                for _ in range(drop2):
                    if i2 < len(mazo2):
                        cartas_mezcladas.append(mazo2[i2])
                        i2 += 1
            else:
                # Tomar del mazo2 primero
                for _ in range(drop2):
                    if i2 < len(mazo2):
                        cartas_mezcladas.append(mazo2[i2])
                        i2 += 1
                
                # Luego del mazo1
                for _ in range(drop1):
                    if i1 < len(mazo1):
                        cartas_mezcladas.append(mazo1[i1])
                        i1 += 1
        
        # Agregar cartas restantes
        cartas_mezcladas.extend(mazo1[i1:])
        cartas_mezcladas.extend(mazo2[i2:])
        
        self.cartas = cartas_mezcladas
        
        # Barajado adicional para mayor aleatoriedad
        self._barajado_adicional()
    
    def _barajado_adicional(self):
        """Barajado adicional para simular múltiples mezclas"""
        # Realizar 2-3 mezclas adicionales
        for _ in range(random.randint(2, 3)):
            # Tomar algunas cartas del medio y ponerlas arriba o abajo
            if len(self.cartas) > 10:
                inicio = random.randint(5, len(self.cartas) - 5)
                fin = inicio + random.randint(3, 8)
                
                cartas_movidas = self.cartas[inicio:fin]
                cartas_restantes = self.cartas[:inicio] + self.cartas[fin:]
                
                if random.choice([True, False]):
                    # Mover al inicio
                    self.cartas = cartas_movidas + cartas_restantes
                else:
                    # Mover al final
                    self.cartas = cartas_restantes + cartas_movidas

class JuegoSolitario:
    def __init__(self):
        self.baraja = Baraja()
        self.montones = {i: [] for i in range(1, 14)}  # 1=A, 2-10=números, 11=J, 12=Q, 13=K
        self.estado = "esperando"  # esperando, barajando, repartiendo, jugando, terminado
        self.mensaje = ""
        self.montonActual = 1  # Comenzamos con el As
        self.pregunta = ""
        self.resultado = ""
        self.jugadas = []
        self.cartas_boca_abajo = {i: [] for i in range(1, 14)}  # Cartas boca abajo en cada montón
        self.cartas_boca_arriba = {i: [] for i in range(1, 14)}  # Cartas boca arriba en cada montón
        
    def iniciar_barajado(self):
        self.baraja = Baraja()
        self.baraja.barajar_clasico()
        self.estado = "barajando"
        self.mensaje = "Barajando cartas..."
        self.montones = {i: [] for i in range(1, 14)}
        self.cartas_boca_abajo = {i: [] for i in range(1, 14)}
        self.cartas_boca_arriba = {i: [] for i in range(1, 14)}
        self.jugadas = []
        self.resultado = ""
        
    def repartir_cartas(self):
        if self.estado != "barajando":
            return {"error": "Debe barajar primero"}
            
        self.estado = "repartiendo"
        self.mensaje = "Repartiendo cartas..."
        
        # Repartir 4 cartas a cada montón (boca abajo)
        for i in range(4):
            for j in range(1, 14):
                if len(self.baraja.cartas) > 0:
                    carta = self.baraja.cartas.pop()
                    self.cartas_boca_abajo[j].append(carta)
        
        self.estado = "jugando"
        self.mensaje = "¡Cartas repartidas! Haz clic en el montón del AS para comenzar."
        self.montonActual = 1
        
    def hacer_jugada(self, montonId):
        if self.estado != "jugando":
            return {"error": "El juego no está activo"}
        
        if montonId != self.montonActual:
            return {"error": f"Debes jugar en el montón {self.obtener_nombre_carta(self.montonActual)}"}
        
        if not self.cartas_boca_abajo[montonId]:
            self.estado = "terminado"
            self.resultado = "negativo"
            self.mensaje = "¡Montón vacío! Tu deseo no se cumplirá ❌"
            return {"terminado": True, "resultado": "negativo"}
        
        # Voltear la carta superior (boca abajo)
        carta = self.cartas_boca_abajo[montonId].pop()
        valor_carta = carta.valor_numerico()
        
        # Colocar la carta en su montón correspondiente (boca arriba, al fondo)
        self.cartas_boca_arriba[valor_carta].insert(0, carta)  # Insertar al principio (abajo)
        
        # Agregar jugada al historial
        self.jugadas.append({
            "desde": montonId,
            "hacia": valor_carta,
            "carta": f"{carta.palo}{carta.numero}",
            "desde_nombre": self.obtener_nombre_carta(montonId),
            "hacia_nombre": self.obtener_nombre_carta(valor_carta)
        })
        
        # Actualizar el montón actual
        self.montonActual = valor_carta
        
        # Verificar si ganamos (un montón completo)
        if len(self.cartas_boca_arriba[valor_carta]) == 4:
            self.estado = "terminado"
            self.resultado = "positivo"
            nombre_carta = self.obtener_nombre_carta(valor_carta)
            self.mensaje = f"¡Felicidades! Completaste el montón de {nombre_carta}. Tu deseo se cumplirá ✨"
            return {"terminado": True, "resultado": "positivo", "carta_volteada": f"{carta.palo}{carta.numero}"}
        
        # Verificar si perdimos (montón actual sin cartas boca abajo)
        if not self.cartas_boca_abajo[self.montonActual]:
            self.estado = "terminado"
            self.resultado = "negativo"
            self.mensaje = "¡Montón vacío! Tu deseo no se cumplirá ❌"
            return {"terminado": True, "resultado": "negativo", "carta_volteada": f"{carta.palo}{carta.numero}"}
        
        nombre_carta = self.obtener_nombre_carta(valor_carta)
        self.mensaje = f"Carta {carta.palo}{carta.numero} colocada en montón {nombre_carta}. Siguiente: montón {self.obtener_nombre_carta(self.montonActual)}"
        return {"continuar": True, "carta_volteada": f"{carta.palo}{carta.numero}"}
    
    def obtener_nombre_carta(self, valor):
        nombres = {1: "AS", 11: "J", 12: "Q", 13: "K"}
        return nombres.get(valor, str(valor))
    
    def obtener_estado(self):
        return {
            "estado": self.estado,
            "mensaje": self.mensaje,
            "montonActual": self.montonActual,
            "cartas_boca_abajo": {k: len(v) for k, v in self.cartas_boca_abajo.items()},
            "cartas_boca_arriba": {k: len(v) for k, v in self.cartas_boca_arriba.items()},
            "montones_boca_abajo": {k: [f"{c.palo}{c.numero}" for c in v] for k, v in self.cartas_boca_abajo.items()},
            "montones_boca_arriba": {k: [f"{c.palo}{c.numero}" for c in v] for k, v in self.cartas_boca_arriba.items()},
            "pregunta": self.pregunta,
            "resultado": self.resultado,
            "jugadas": self.jugadas
        }

# Instancia global del juego
juego = JuegoSolitario()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/establecer_pregunta', methods=['POST'])
def establecer_pregunta():
    global juego
    data = request.json
    pregunta = data.get('pregunta', '')
    juego.pregunta = pregunta
    return jsonify({"mensaje": "Pregunta establecida", "pregunta": pregunta})

@app.route('/barajar_cartas', methods=['POST'])
def barajar_cartas():
    """Endpoint para barajar las cartas"""
    global juego
    juego.iniciar_barajado()
    return jsonify({
        'mensaje': 'Cartas barajadas exitosamente',
        'total_cartas': len(juego.baraja.cartas),
        'barajado_completado': True,
        'metodo': 'barajado_clasico',
        'estado': juego.obtener_estado()
    })

@app.route('/repartir_cartas', methods=['POST'])
def repartir_cartas():
    """Endpoint para repartir las cartas"""
    global juego
    juego.repartir_cartas()
    return jsonify({
        'mensaje': 'Cartas repartidas exitosamente',
        'estado': juego.obtener_estado()
    })

@app.route('/hacer_jugada', methods=['POST'])
def hacer_jugada():
    """Endpoint para hacer una jugada"""
    global juego
    data = request.json
    montonId = data.get('montonId')
    
    if montonId:
        resultado = juego.hacer_jugada(montonId)
        resultado['estado'] = juego.obtener_estado()
        return jsonify(resultado)
    
    return jsonify({"error": "No se especificó montón"})

@app.route('/estado_juego', methods=['GET'])
def estado_juego():
    global juego
    return jsonify(juego.obtener_estado())

@app.route('/nuevo_juego', methods=['POST'])
def nuevo_juego():
    global juego
    juego = JuegoSolitario()
    return jsonify({"mensaje": "Nuevo juego creado", "estado": juego.obtener_estado()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

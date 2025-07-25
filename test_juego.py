"""
Pruebas para el Juego de Cartas Solitario
"""

import unittest
import json
from app import app, Carta, Baraja, JuegoSolitario

class TestJuegoCartas(unittest.TestCase):
    
    def setUp(self):
        """Configurar el entorno de pruebas"""
        self.app = app.test_client()
        self.app.testing = True
    
    def test_crear_carta(self):
        """Probar la creación de una carta"""
        carta = Carta('A', 'Corazones')
        self.assertEqual(carta.numero, 'A')
        self.assertEqual(carta.palo, 'Corazones')
        self.assertFalse(carta.visible)
    
    def test_crear_baraja(self):
        """Probar la creación de una baraja completa"""
        baraja = Baraja()
        self.assertEqual(len(baraja.cartas), 52)
        
        # Verificar que existan todos los palos
        palos = set(carta.palo for carta in baraja.cartas)
        self.assertEqual(len(palos), 4)
        
        # Verificar que existan todas las cartas
        numeros = set(carta.numero for carta in baraja.cartas)
        self.assertEqual(len(numeros), 13)
    
    def test_barajar_clasico(self):
        """Probar el barajado clásico"""
        baraja = Baraja()
        cartas_originales = [str(carta) for carta in baraja.cartas]
        
        baraja.barajar_clasico()
        cartas_barajadas = [str(carta) for carta in baraja.cartas]
        
        # Verificar que sigue habiendo 52 cartas
        self.assertEqual(len(cartas_barajadas), 52)
        
        # Verificar que las cartas han cambiado de orden
        # (muy improbable que queden en el mismo orden)
        self.assertNotEqual(cartas_originales, cartas_barajadas)
    
    def test_inicializar_juego(self):
        """Probar la inicialización del juego"""
        juego = JuegoSolitario()
        
        # Verificar que hay 13 montones
        self.assertEqual(len(juego.montones), 13)
        
        # Verificar que cada montón tiene 4 cartas
        for i in range(1, 14):
            self.assertEqual(len(juego.montones[str(i)]), 4)
        
        # Verificar posición inicial
        self.assertEqual(juego.posicion_actual, 0)
        self.assertFalse(juego.juego_terminado)
        self.assertFalse(juego.juego_ganado)
    
    def test_get_posicion_numero(self):
        """Probar la conversión de números de carta a posiciones"""
        juego = JuegoSolitario()
        
        self.assertEqual(juego.get_posicion_numero('A'), 1)
        self.assertEqual(juego.get_posicion_numero('5'), 5)
        self.assertEqual(juego.get_posicion_numero('J'), 11)
        self.assertEqual(juego.get_posicion_numero('Q'), 12)
        self.assertEqual(juego.get_posicion_numero('K'), 13)
    
    def test_voltear_carta(self):
        """Probar el volteo de cartas"""
        juego = JuegoSolitario()
        
        # Voltear primera carta
        resultado = juego.voltear_carta(1)  # Comenzar en AS
        self.assertTrue(resultado)
        
        # Verificar que la carta actual existe
        self.assertIsNotNone(juego.carta_actual)
        
        # Verificar que la carta está visible
        self.assertTrue(juego.carta_actual.visible)
    
    def test_endpoint_home(self):
        """Probar el endpoint principal"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Juego de Cartas Solitario', response.data)
    
    def test_endpoint_nuevo_juego(self):
        """Probar el endpoint de nuevo juego"""
        data = {'pregunta': '¿Funcionará esta prueba?'}
        response = self.app.post('/nuevo_juego', 
                                data=json.dumps(data),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        
        respuesta = json.loads(response.data)
        self.assertIn('montones', respuesta)
        self.assertIn('posicion_actual', respuesta)
        self.assertIn('juego_terminado', respuesta)
        self.assertEqual(respuesta['pregunta_oraculo'], data['pregunta'])
    
    def test_endpoint_estado_juego(self):
        """Probar el endpoint de estado del juego"""
        response = self.app.get('/estado_juego')
        self.assertEqual(response.status_code, 200)
        
        respuesta = json.loads(response.data)
        self.assertIn('montones', respuesta)
        self.assertIn('posicion_actual', respuesta)
        self.assertIn('juego_terminado', respuesta)
    
    def test_endpoint_voltear_carta(self):
        """Probar el endpoint de voltear carta"""
        # Primero iniciar un juego
        data = {'pregunta': '¿Funcionará el volteo?'}
        self.app.post('/nuevo_juego', 
                     data=json.dumps(data),
                     content_type='application/json')
        
        # Luego voltear una carta
        data = {'posicion': 1}
        response = self.app.post('/voltear_carta',
                                data=json.dumps(data),
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        
        respuesta = json.loads(response.data)
        self.assertIn('carta_actual', respuesta)
    
    def test_endpoint_jugar_automatico(self):
        """Probar el endpoint de juego automático"""
        # Primero iniciar un juego
        data = {'pregunta': '¿Funcionará el juego automático?'}
        self.app.post('/nuevo_juego', 
                     data=json.dumps(data),
                     content_type='application/json')
        
        # Luego jugar automáticamente
        response = self.app.post('/jugar_automatico',
                                content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        
        respuesta = json.loads(response.data)
        self.assertIn('pasos', respuesta)
        self.assertIn('estado_final', respuesta)
        self.assertTrue(respuesta['estado_final']['juego_terminado'])

class TestLogicaJuego(unittest.TestCase):
    """Pruebas específicas para la lógica del juego"""
    
    def test_multiples_juegos(self):
        """Probar múltiples juegos consecutivos"""
        for i in range(5):
            juego = JuegoSolitario()
            juego.pregunta_oraculo = f"¿Pregunta {i}?"
            
            # Jugar automáticamente
            pasos = juego.jugar_automatico()
            
            # Verificar que terminó
            self.assertTrue(juego.juego_terminado)
            
            # Verificar que hay pasos
            self.assertGreater(len(pasos), 0)
    
    def test_casos_limite(self):
        """Probar casos límite del juego"""
        juego = JuegoSolitario()
        
        # Intentar voltear carta de montón vacío
        # Primero vaciamos un montón
        juego.montones['1'] = []
        
        resultado = juego.voltear_carta(1)
        self.assertFalse(resultado)
        self.assertTrue(juego.juego_terminado)
    
    def test_validacion_estado(self):
        """Probar la validación del estado del juego"""
        juego = JuegoSolitario()
        estado = juego.get_estado_juego()
        
        # Verificar estructura del estado
        campos_requeridos = [
            'montones', 'posicion_actual', 'carta_actual',
            'juego_terminado', 'juego_ganado', 'posiciones'
        ]
        
        for campo in campos_requeridos:
            self.assertIn(campo, estado)
        
        # Verificar que los montones tienen la estructura correcta
        for i in range(1, 14):
            self.assertIn(str(i), estado['montones'])
            for carta in estado['montones'][str(i)]:
                self.assertIn('numero', carta)
                self.assertIn('palo', carta)
                self.assertIn('visible', carta)

if __name__ == '__main__':
    print("🧪 Ejecutando pruebas del Juego de Cartas Solitario...")
    print("=" * 50)
    
    # Ejecutar las pruebas
    unittest.main(verbosity=2)

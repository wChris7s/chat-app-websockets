import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from './models/mensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // Atributos

  private client: Client; // Stomp client
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = [];
  escribiendo: string;
  clienteId: string;

  // Constructor
  constructor() {
    this.clienteId = 'id-' + new Date().getUTCMilliseconds() + '-' + Math.random().toString(36).substr(2);
  }

  ngOnInit(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS('http://localhost:8080/chat-websocket'); // Ruta de conexión hacia el Broker.
    };

    // Cuando se conecte el cliente al Broker, se ejecutará la función.
    // connected -> Booleano que indica si el cliente está conectado o no.
    // frame -> Información de conexión con el broker.
    this.client.onConnect = (frame) => {
      console.log("Conectados: " + this.client.connected + " : " + frame);
      this.conectado = true;

      this.client.subscribe('/chat/mensaje', e => {
        // Escucha cada que se recibe un mensaje del servidor. Cuando un usuario escribe un 
        // mensaje, el broker lo recibe y lo envía a todos los usuarios subscritos al evento.
        let mensaje: Mensaje = JSON.parse(e.body) as Mensaje;  // Convertimos el mensaje recibido a un objeto de tipo Mensaje.
        mensaje.fecha = new Date(mensaje.fecha);

        if(!this.mensaje.color && mensaje.tipo == 'NEW_USER' && this.mensaje.username == mensaje.username) {
          // Si el color no está definido y el mensaje es de tipo NEW_USER y el username del mensaje es igual al username del mensaje del cliente.
          // Asignamos el color del mensaje del cliente al color del mensaje recibido.
          this.mensaje.color = mensaje.color;
        }

        this.mensajes.push(mensaje);  // Agregamos el mensaje al arreglo de mensajes.
        console.log(mensaje);
      });

      this.client.subscribe('/chat/escribiendo', e => {
        this.escribiendo = e.body;
        setTimeout(() => this.escribiendo = '', 3000); // Después de 3 segundos, limpiamos el campo de texto.
      });

      console.log(this.clienteId);
      this.client.subscribe('/chat/historial/' + this.clienteId, e => {
        const historial = JSON.parse(e.body) as Mensaje[];
        this.mensajes = historial.map(mensaje => {
          mensaje.fecha = new Date(mensaje.fecha); // Convertimos la fecha de string a Date.
          return mensaje;
        }).reverse(); // Ordenamos los mensajes de más reciente a más antiguo.
      });

      this.client.publish({destination: '/app/historial', body: this.clienteId}); // Mandamos el id del cliente para que el servidor nos mande el historial de mensajes.

      this.mensaje.tipo = 'NEW_USER';
      this.client.publish({
        destination: '/app/mensaje', // Ruta del controlador que recibe el mensaje.
        body: JSON.stringify(this.mensaje), // Convertimos el mensaje a un string.
      });
    }
    
    this.client.onDisconnect = (frame) => {
      console.log("Desconectados: " + !this.client.connected + " : " + frame);
      this.conectado = false;

      // Limpiamos los mensajes y el mensaje del cliente.
      this.mensaje = new Mensaje();
      this.mensajes = [];
    };
  }

  // Métodos
  desconectar(): void {
    // Desconectamos el cliente al Broker.
    this.client.deactivate();
  }

  conectar(): void {
    // Conectamos el cliente al Broker.
    this.client.activate();
  }

  sendMessage(): void {
    this.mensaje.tipo = 'MESSAGE';
    this.client.publish({
      destination: '/app/mensaje', // Ruta del controlador que recibe el mensaje.
      body: JSON.stringify(this.mensaje), // Convertimos el mensaje a un string.
    });
    this.mensaje.texto = ''; // Limpiamos el campo de texto.
  }

  writing(): void {
    this.client.publish({
      destination: '/app/escribiendo', // Ruta del controlador que recibe el mensaje.
      body: this.mensaje.username, // Mandamos el username (string).
    });
  }
}

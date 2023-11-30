# Web Sockets

## Introducción

### Problemática Rest

- No existe forma de avisar al cliente que algo ha cambiado en el servidor.
- El cliente debe estar constantemente preguntando al servidor si algo ha cambiado.
- Cargas innecesarias en el servidor.

### Solución

#### Sockets

- Comunicación directa, bidireccional y asincrónica, comunicación abierta entre cliente y servidor.
- Pueden haber multiples clientes conectados a un mismo servidor.
- El servidor puede disparar notificaciones a cada cliente conectado.
- Actualizaciones en tiempo real.
- Diferentes canales de comunicación.
- Subscripción a canales distintos.

## Sockets vs Rest

| Sockets                                                                                                           | Rest                                                                                  |
|-------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| Comunicación bidireccional en timepo real entre el cliente y servidor y viceversa. También clientes con clientes. | Aplicaciones comunes que no requieren actualización en tiempo real, típicamente CRUD. |
| Una sola URL endpoint para la conexión inicial y todos los mensajes fluyen en esa misma conexión TCP.             | Muchas URLs endpoint para interactuar con la aplicación (solicitud respuesta).        |

## Protocolo STOMP

- Protocolo de mensajería orientado a texto simple. (Multiplataforma, multilenguaje)
- Define un protocolo para la comunicación asincrona entre clientes y tambíen a través de un intermediario de mensajes
  que sería el servidor (broker).
- Define un conjunto de operaciones: connect, subscribe, unsubscribe, send o publish, disconnect.
- Capa de abstracción por sobre los websocket.

| Métodos        | Descripción                                                             |
|----------------|-------------------------------------------------------------------------|
| Connect        | Establece una conexión con el broker de mensajeria                      |
| Subscribe      | El cliente se suscribe a un evento del broker                           |
| Unsubscribe    | El cliente se desuscribe de un evento del broker                        |
| Send o Publish | El cliente que esta suscrito envia un mensaje a un destino en el broker |
| Disconnect     | Cierra la sesión con el agento de mensajeria                            |

### StompJs - Cliente

| Métodos      | Descripción                                                                                                                                     |
|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| onConnect    | Función de retorno que se ejecuta cuando se conecta al broker.                                                                                  |
| onDisconnect | Función de retorno que se ejecuta cuando se desconecta del broker.                                                                              |
| subscribe    | Permite suscribirse a un evento (tópico del broker), posee una función de retorno que implemetna la lógica con el objeto recibido del servidor. |
| publish      | Envía un mensaje al broker, el broker lo maneja y lo notifica a los clientes suscritos.                                                         |

### Spring Boot - Servidor

| Métodos         | Descripción                                                                                                                |
|-----------------|----------------------------------------------------------------------------------------------------------------------------|
| @MessageMapping | Anotación que indica el destino al cual los clientes van a enviar mensajes. Escucha eventos cuando llega un nuevo mensaje. |
| @SendTo         | Anotación que notifica o emite un mensaje a los clientes suscritos.                                                        |

package com.cw.backend.websocket.controller;

import com.cw.backend.websocket.model.document.Mensaje;
import com.cw.backend.websocket.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Date;
import java.util.Random;

@Controller
public class ChatController {

   @Autowired
   private ChatService chatService;

   @Autowired
   private SimpMessagingTemplate webSocket;

   private final String[] colors = {"red", "green", "blue", "magenta", "purple", "orange"};

   @MessageMapping("/mensaje")   // app/mensaje => Tiene un prefijo
   @SendTo("/chat/mensaje")      // Notifica a los clientes subscritos al evento: /chat/mensaje
   public Mensaje recibeMensaje(Mensaje mensaje) {
      mensaje.setFecha(new Date().getTime());
      if (mensaje.getTipo().equals("NEW_USER")) {
         mensaje.setColor(colors[new Random().nextInt(colors.length)]);
         mensaje.setTexto("Nuevo usuario");
      } else {
         chatService.save(mensaje);
      }
      return mensaje;
   }

   @MessageMapping("/escribiendo")   // app/mensaje => Tiene un prefijo
   @SendTo("/chat/escribiendo")      // Notifica a los clientes subscritos al evento: /chat/mensaje
   public String estaEscribiendo(String username) {
      return username.concat(" esta escribiendo ...");
   }

   @MessageMapping("/historial")
   public void historial(String clientID) {
      webSocket.convertAndSend("/chat/historial/" + clientID, chatService.getLastTenMessage());
   }
}

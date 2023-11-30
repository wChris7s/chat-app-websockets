package com.cw.backend.websocket.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Habilita el servidor.
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
   @Override
   public void registerStompEndpoints(StompEndpointRegistry registry) {
      registry
       .addEndpoint("/chat-websocket")
       .setAllowedOrigins("http://localhost:4200") // Cors
       .withSockJS();
   }

   @Override
   public void configureMessageBroker(MessageBrokerRegistry registry) {
      registry
       .enableSimpleBroker("/chat/");  // Prefijo del evento.
      registry
       .setApplicationDestinationPrefixes("/app");      // Prefijo del destino.
   }
}

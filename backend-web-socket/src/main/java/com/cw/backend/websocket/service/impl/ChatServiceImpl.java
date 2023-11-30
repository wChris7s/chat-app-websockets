package com.cw.backend.websocket.service.impl;

import com.cw.backend.websocket.model.document.Mensaje;
import com.cw.backend.websocket.repository.ChatRepository;
import com.cw.backend.websocket.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {
   @Autowired
   private ChatRepository chatRepository;
   @Override
   public List<Mensaje> getLastTenMessage() {
      return chatRepository.findFirst10ByOrderByFechaDesc();
   }

   @Override
   public Mensaje save(Mensaje mensaje) {
      return chatRepository.save(mensaje);
   }
}

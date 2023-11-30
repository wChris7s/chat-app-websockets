package com.cw.backend.websocket.service;

import com.cw.backend.websocket.model.document.Mensaje;

import java.util.List;

public interface ChatService {
   List<Mensaje> getLastTenMessage();
   Mensaje save(Mensaje mensaje);
}

package com.cw.backend.websocket.repository;

import com.cw.backend.websocket.model.document.Mensaje;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRepository extends MongoRepository<Mensaje, String> {
   List<Mensaje> findFirst10ByOrderByFechaDesc();
}

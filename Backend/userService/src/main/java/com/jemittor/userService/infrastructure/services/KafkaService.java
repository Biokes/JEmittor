package com.jemittor.userService.infrastructure.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaService {
    @KafkaListener(topics ="keycloak-user-events")
    public void handleRegister(String message){
        log.info("Message received after registration from kafka = {}", message);
    }
}

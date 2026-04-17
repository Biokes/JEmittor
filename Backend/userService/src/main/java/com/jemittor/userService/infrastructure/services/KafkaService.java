package com.jemittor.userService.infrastructure.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaService {
    @KafkaListener(topics ="keycloak-user-events")
    public void handleRegister(String message){

    }
}

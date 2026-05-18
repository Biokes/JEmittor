package main.java.com.jemittor.userService.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
public class User{
    @Id
    private UUID id;
    @Column(unique = true, nullable = false)
    private String keycloakId;
    private String email;
    private String profilePictureUrl;
    private String displayName;
    private String notificationEmail;
}
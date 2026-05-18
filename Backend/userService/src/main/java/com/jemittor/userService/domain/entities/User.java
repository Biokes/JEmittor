package com.jemittor.userService.domain.entities;

import com.jemittor.userService.domain.constants.AccountStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="profiles")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User{
    @Id
    private UUID id;
    @Column(unique = true, nullable = false)
    private String keycloakId;
    private String email;
    private String profilePictureUrl;
    private String displayName;
    private String notificationEmail;
    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus = AccountStatus.CREATED;
    @Setter(AccessLevel.NONE)
    private LocalDateTime dateJoined =  LocalDateTime.now();
}

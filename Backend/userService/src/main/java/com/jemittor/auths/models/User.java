package com.jemittor.auths.models;

import com.jemittor.auths.models.enums.ProfileType;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@Entity
@ToString
@NoArgsConstructor
@Builder
@Setter
@Getter
@Table(name="JEmittor_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer userId;

    @Column
    private String profileImageURI;

    @Column(unique = true, nullable = false)
    private String email;

    @Column
    private String name;

    @Column
    private String googleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProfileType profileType;

}

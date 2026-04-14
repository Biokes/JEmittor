package com.jemittor.userService;

//@Setter
//@Getter
@Data
public class User{
    private UUID id;
    private String keycloakId;
    private String email;
    private String profilePictureUrl;
    private String displayName;
    private String notificationEmail;
}

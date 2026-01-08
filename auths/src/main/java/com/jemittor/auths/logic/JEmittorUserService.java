package com.jemittor.auths.logic;

import com.jemittor.auths.models.User;
import com.jemittor.auths.models.enums.ProfileType;
import com.jemittor.auths.repository.JEmittorUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JEmittorUserService implements UserService {
    @Autowired
    private JEmittorUserRepository userRepository;

    @Override
    public void createProfileIfNotExist(String email, String name, String googleId, String picture) {
        userRepository.findUserByEmail(email.toLowerCase())
                        .ifPresentOrElse(
                                user -> updateUserProfile(email, name, googleId, picture, user),
                                ()-> createUserProfile(email, name, googleId, picture)
                        );
    }

    private void createUserProfile(String email, String name, String googleId, String picture) {
        User userCreated = User.builder()
                .email(email.toLowerCase())
                .name(name)
                .googleId(googleId)
                .profileImageURI(picture)
                .profileType(ProfileType.BASIC)
                .build();
        userRepository.save(userCreated);
    }

    private void updateUserProfile(String email, String name, String googleId, String picture, User updatedUser) {
        updatedUser.setName(name.toLowerCase());
        updatedUser.setGoogleId(googleId);
        updatedUser.setEmail(email.toLowerCase());
        updatedUser.setProfileImageURI(picture);
        userRepository.save(updatedUser);
    }
}

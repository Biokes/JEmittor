package com.jemittor.auths.logic;

public interface UserService {
    void updateUserProfile(String email, String name, String googleId, String picture);
}

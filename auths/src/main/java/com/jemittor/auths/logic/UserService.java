package com.jemittor.auths.logic;

public interface UserService {
    void createProfileIfNotExist(String email, String name, String googleId, String picture);
}

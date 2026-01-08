package com.jemittor.auths.repository;

import com.jemittor.auths.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface JEmittorUserRepository extends JpaRepository<User, Integer> {
//    @Query("SELECT user FROM User user WHERE user.email = :email")
    Optional<User> findUserByEmail(String email);
}

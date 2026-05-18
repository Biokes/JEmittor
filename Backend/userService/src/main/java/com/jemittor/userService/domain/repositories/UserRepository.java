package main.java.com.jemittor.userService.domain.repositories;

import main.java.com.jemittor.userService.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
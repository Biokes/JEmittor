package com.jemittor.auths.controllers;

import com.jemittor.auths.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/v1/auth")
public class Auth {
    @GetMapping("/")
    public ResponseEntity<ApiResponse<String>> login(OAuth2AuthenticationToken token){
        ApiResponse<String> response =  new ApiResponse<>(true, token.getPrincipal().getAttribute("email"),200);
        return ResponseEntity.status(OK).body(response);
    }
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        ApiResponse<String> response = new ApiResponse<>(true, "Logged out successfully", 200);
        return ResponseEntity.status(OK).body(response);
    }
}

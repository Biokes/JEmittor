package com.jemittor.userService.api;

import com.jemittor.userService.application.UserService;
import com.jemittor.userService.application.requests.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/User")
public class UserController{
    @Autowired
    private UserService userService ;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> me(@AuthenticationPrincipal Jwt jwt){
//        String userId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.status(OK).body(userService.getUserProfile(email));
    }
}


// user can update profile
// user can get profile

package com.jemittor.userService.application;

import com.jemittor.userService.application.requests.ApiResponse;

public interface UserService {

    ApiResponse<?> getUserProfile(String email);
}

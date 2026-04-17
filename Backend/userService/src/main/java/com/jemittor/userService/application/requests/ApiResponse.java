package com.jemittor.userService.application.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ApiResponse<T> {
    private T data;
    private boolean success;
    private LocalDateTime timeStamp = LocalDateTime.now();
}

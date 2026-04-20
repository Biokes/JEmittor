package com.jemittor.auths.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ApiResponse<T> {
    private boolean isSuccessful;
    private T responseData;
    private Integer status;
}

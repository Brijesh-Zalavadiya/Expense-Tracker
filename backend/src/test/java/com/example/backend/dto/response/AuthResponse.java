package com.example.backend.dto.response;

public record AuthResponse(
        String accessToken,
        String email
) {
}

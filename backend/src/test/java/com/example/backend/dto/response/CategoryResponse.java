package com.example.backend.dto.response;

import com.example.backend.entity.TransactionType;

public record CategoryResponse (
        Long id,
        String name,
        TransactionType type
){
}

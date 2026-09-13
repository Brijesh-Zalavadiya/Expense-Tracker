package com.example.backend.dto.response;

import com.example.backend.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        Long userId,
        BigDecimal amount,
        TransactionType type,
        Long categoryId,
        LocalDate data,
        String description,
        String paymentMethod,
        String notes
) {
}

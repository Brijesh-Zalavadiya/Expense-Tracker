package com.example.backend.dto.request;

import com.example.backend.entity.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotBlank @DecimalMin("0.01") BigDecimal amount,
        @NotNull TransactionType type,
        Long categoryId,
        @NotNull LocalDate data,
        String description,
        String paymentMethod,
        String notes
        ) {
}

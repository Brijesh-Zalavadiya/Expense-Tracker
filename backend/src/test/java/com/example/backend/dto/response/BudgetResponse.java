package com.example.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BudgetResponse(
        Long id,
        Long categoryId,
        String categoryName,
        LocalDate periodMonth,
        BigDecimal limitAmount,
        Integer alertThresholdPct
) {
}

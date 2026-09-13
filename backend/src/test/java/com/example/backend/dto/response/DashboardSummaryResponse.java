package com.example.backend.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummaryResponse(
        String month,
        BigDecimal income,
        BigDecimal expense,
        BigDecimal net,
        List<CategoryBreakdown> byCategory
) {
    public record CategoryBreakdown(
            Long categoryId,
            String categoryName,
            BigDecimal amount
    ){}
}

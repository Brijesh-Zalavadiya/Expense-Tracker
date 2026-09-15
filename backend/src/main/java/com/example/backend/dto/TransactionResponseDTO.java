package com.example.backend.dto;

import com.example.backend.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionResponseDTO {
    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate transactionDate;
    private TransactionType type;
    private Long userId;
    private Long categoryId;

    public TransactionResponseDTO(){}

    public TransactionResponseDTO(Long id, BigDecimal amount, String description, LocalDate transactionDate, TransactionType type, Long userId, Long categoryId) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.transactionDate = transactionDate;
        this.type = type;
        this.userId = userId;
        this.categoryId = categoryId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}

package com.example.backend.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.TypeAlias;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "budgets")
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category; // null = overall budget

    @Column(nullable = false)
    private java.time.LocalDate periodMonth; // e.g. 2026-09-01

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal limitAmount;

    @Column(nullable = false)
    private Integer alertThresholdPct = 80;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Budget(){}

    public Budget(User user, Category category, LocalDate periodMonth, BigDecimal limitAmount, Integer alertThresholdPct, Instant createdAt) {
        this.user = user;
        this.category = category;
        this.periodMonth = periodMonth;
        this.limitAmount = limitAmount;
        this.alertThresholdPct = alertThresholdPct;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public LocalDate getPeriodMonth() {
        return periodMonth;
    }

    public void setPeriodMonth(LocalDate periodMonth) {
        this.periodMonth = periodMonth;
    }

    public BigDecimal getLimitAmount() {
        return limitAmount;
    }

    public void setLimitAmount(BigDecimal limitAmount) {
        this.limitAmount = limitAmount;
    }

    public Integer getAlertThresholdPct() {
        return alertThresholdPct;
    }

    public void setAlertThresholdPct(Integer alertThresholdPct) {
        this.alertThresholdPct = alertThresholdPct;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

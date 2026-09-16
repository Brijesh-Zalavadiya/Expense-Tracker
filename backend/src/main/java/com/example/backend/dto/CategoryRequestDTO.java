package com.example.backend.dto;

import com.example.backend.entity.TransactionType;

public class CategoryRequestDTO {
    private String name;
    private TransactionType type;

    public CategoryRequestDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }
}

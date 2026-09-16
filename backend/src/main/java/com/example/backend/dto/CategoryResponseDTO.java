package com.example.backend.dto;

import com.example.backend.entity.TransactionType;

public class CategoryResponseDTO {
    private Long id;
    private String name;
    private TransactionType type;

    public CategoryResponseDTO() {
    }

    public CategoryResponseDTO(Long id, String name, TransactionType type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

package com.example.backend.service;

import com.example.backend.dto.CategoryRequestDTO;
import com.example.backend.dto.CategoryResponseDTO;
import com.example.backend.entity.Category;
import com.example.backend.entity.Transaction;
import com.example.backend.entity.TransactionType;
import com.example.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponseDTO> getAllCategory(){
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<CategoryResponseDTO> getByType(TransactionType type){
        return categoryRepository.findByType(type)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public CategoryResponseDTO convertToResponse(Category category){
        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getType()
        );
    }
}

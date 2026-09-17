package com.example.backend.service;

import com.example.backend.dto.CategoryRequestDTO;
import com.example.backend.dto.CategoryResponseDTO;
import com.example.backend.entity.Category;
import com.example.backend.entity.Transaction;
import com.example.backend.entity.TransactionType;
import com.example.backend.repository.CategoryRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        if(categoryRepository.findByType(type).isEmpty()){
            throw new RuntimeException("Category type not found.");
        }

        return categoryRepository.findByType(type)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public CategoryResponseDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return convertToResponse(category);
    }

    public CategoryResponseDTO addCategory(CategoryRequestDTO dto){
        if(categoryRepository.findByName(dto.getName()).isPresent()){
            throw new RuntimeException("Category is already exist.");
        }

        Category category = new Category();
        category.setName(dto.getName());
        category.setType(dto.getType());

        categoryRepository.save(category);

        return convertToResponse(category);
    }

    public String deleteCategory(Long id){
        if(categoryRepository.findById(id).isEmpty()){
            throw new RuntimeException("Category not found");
        }

        categoryRepository.deleteById(id);

        return "Category deleted successfully.";
    }

    public CategoryResponseDTO convertToResponse(Category category){
        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getType()
        );
    }
}

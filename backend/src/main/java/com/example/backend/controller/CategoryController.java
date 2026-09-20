package com.example.backend.controller;

import com.example.backend.dto.CategoryRequestDTO;
import com.example.backend.dto.CategoryResponseDTO;
import com.example.backend.entity.TransactionType;
import com.example.backend.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponseDTO> getAllCategory(){
        return categoryService.getAllCategory();
    }

    @GetMapping("/type_{type}")
    public List<CategoryResponseDTO> getByType(@PathVariable TransactionType type){
        return categoryService.getByType(type);
    }

    @GetMapping("/{id}")
    public CategoryResponseDTO getCategoryById(@PathVariable Long id){
        return categoryService.getCategoryById(id);
    }

    @PostMapping
    public CategoryResponseDTO addCategory(@RequestBody CategoryRequestDTO dto){
        return categoryService.addCategory(dto);
    }

    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id){
        return categoryService.deleteCategory(id);
    }

}

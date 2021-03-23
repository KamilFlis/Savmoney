package com.example.ztpai.controller;

import com.example.ztpai.model.Category;
import com.example.ztpai.repository.CategoryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CategoryController {

    private final CategoryRepository repository;

    public CategoryController(CategoryRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/categories")
    List<Category> all() {
        return repository.findAll();
    }


}

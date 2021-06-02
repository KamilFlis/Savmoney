package com.example.ztpai.controller;

import com.example.ztpai.model.Category;
import com.example.ztpai.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class CategoryController {

    @Autowired
    private CategoryRepository repository;

    @GetMapping("/categories")
    List<Category> all() {
        return repository.findAll();
    }


}

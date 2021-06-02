package com.example.ztpai.controller;

import com.example.ztpai.dto.ExpenseDTO;
import com.example.ztpai.model.Category;
import com.example.ztpai.model.Expense;
import com.example.ztpai.repository.CategoryRepository;
import com.example.ztpai.repository.ExpenseRepository;
import com.example.ztpai.repository.GroupRepository;
import com.example.ztpai.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ModelMapper modelMapper;

    private String getUser() {
        String username;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }
        return username;
    }

    private LocalDateTime getCurrentDate() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        return LocalDateTime.parse(LocalDateTime.now().format(formatter)).withNano(0);
    }

    @GetMapping("/")
    @CrossOrigin(origins = "http://localhost:3000")
    List<ExpenseDTO> all() {
        Long userId = userRepository.findByUsername(getUser()).getId();
        List<Expense> expenses = repository.findAllByUserIdAndGroupId(userId, null);
        List<ExpenseDTO> expensesDTO = new ArrayList<>();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);
        if(modelMapper.getTypeMap(Expense.class, ExpenseDTO.class) == null) {
            modelMapper.createTypeMap(Expense.class, ExpenseDTO.class)
                    .addMappings(mapper -> mapper.map(src -> src.getCategory().getName(), ExpenseDTO::setCategory));
        }

        for(Expense expense: expenses) {
            expensesDTO.add(modelMapper.map(expense, ExpenseDTO.class));
        }
        return expensesDTO;
    }

    @PostMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:3000")
    Expense newExpense(@RequestBody ExpenseDTO newExpense, @PathVariable Long id) {
        Expense expense = modelMapper.map(newExpense, Expense.class);
        if(id != 0) {
            expense.setGroup(groupRepository.findById(id).orElseThrow(EntityNotFoundException::new));
        }

        expense.setUser(userRepository.findByUsername(getUser()));
        expense.setCategory(categoryRepository.findCategoryByName(newExpense.getCategory()));
        expense.setDate(getCurrentDate());
        return repository.save(expense);
    }

    @GetMapping("/{id}")
    Expense one(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
    }

    @PutMapping("/{id}")
    Expense replaceExpense(@RequestBody Expense newExpense, @PathVariable Long id) {
        return repository.findById(id)
                .map(expense -> {
                    expense.setAmount(newExpense.getAmount());
                    expense.setCategory(newExpense.getCategory());
                    expense.setComment(newExpense.getComment());
                    expense.setCurrency(newExpense.getCurrency());
                    expense.setDate(newExpense.getDate());
                    return repository.save(expense);
                })
                .orElseGet(() -> {
                    newExpense.setId(id);
                    return repository.save(newExpense);
                });
    }

    @GetMapping("/monthly")
    List<ExpenseDTO> getMonthlyExpenses() {
        Long userId = userRepository.findByUsername(getUser()).getId();

        return null;
    }

    @GetMapping("/category")
    Map<String, Double> getCategoryExpenses() {
        Long userId = userRepository.findByUsername(getUser()).getId();
        Map<String, Double> categoryExpenses = new HashMap<>();
        List<Expense> expenses = repository.findAllByUserId(userId);
        List<Category> categories = new ArrayList<>();
        for(Expense expense: expenses) {
            categories.add(expense.getCategory());
        }

        for(Category category: categories) {
            double amount = 0;
            for(Expense expense: expenses) {
                if(expense.getCategory() == category) {
                    amount += expense.getAmount();
                }
            }
            categoryExpenses.put(category.getName(), amount);
        }

        return categoryExpenses;
    }




    @DeleteMapping("/{id}")
    void deleteExpense(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

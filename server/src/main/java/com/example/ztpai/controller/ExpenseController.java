package com.example.ztpai.controller;

import com.example.ztpai.model.Expense;
import com.example.ztpai.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository repository;

    // getting all expenses
    @GetMapping("/")
    @CrossOrigin(origins = "http://localhost:3000")
    List<Expense> all() {
        System.out.println("Expenses");
        return repository.findAll();
    }

    // adding new expense
    @PostMapping("/")
    @CrossOrigin(origins = "http://localhost:3000")
    Expense newExpense(@RequestBody Expense newExpense) {
        System.out.println("amount: " + newExpense.getAmount());
        System.out.println("date: " + newExpense.getDate());
        return repository.save(newExpense);
    }

    // get one expense
    @GetMapping("/{id}")
    Expense one(@PathVariable Long id) {
        System.out.println("id " + id);
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException());
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

    @DeleteMapping("/{id}")
    void deleteExpense(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

package com.example.ztpai.controller;

import com.example.ztpai.model.Expense;
import com.example.ztpai.repository.ExpenseRepository;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.Calendar;
import java.util.List;

@RestController
public class ExpenseController {

    private final ExpenseRepository repository;

    public ExpenseController(ExpenseRepository repository) {
        this.repository = repository;
    }

    // getting all expenses
    @GetMapping("/expenses")
    List<Expense> all() {
        return repository.findAll();
    }

    // adding new expense
    @PostMapping("/expenses")
    Expense newExpense(@RequestBody Expense newExpense) {
        return repository.save(newExpense);
    }

    // get one expense
    @GetMapping("/expenses/{id}")
    Expense one(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException());
    }

    @PutMapping("/expenses/{id}")
    Expense replaceExpense(@RequestBody Expense newExpense, @PathVariable Long id) {
        return repository.findById(id)
                .map(expense -> {
                    expense.setAmount(newExpense.getAmount());
                    expense.setCategory(newExpense.getCategory());
                    expense.setComment(newExpense.getComment());
                    expense.setCurrency(newExpense.getCurrency());
                    expense.setDate(Calendar.getInstance().getTime());
                    return repository.save(expense);
                })
                .orElseGet(() -> {
                    newExpense.setId(id);
                    return repository.save(newExpense);
                });
    }

    @DeleteMapping("/expenses/{id}")
    void deleteExpense(@PathVariable Long id) {
        repository.deleteById(id);
    }
}

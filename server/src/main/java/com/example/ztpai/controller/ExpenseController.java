package com.example.ztpai.controller;

import com.example.ztpai.dto.ExpenseDTO;
import com.example.ztpai.model.Expense;
import com.example.ztpai.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<ExpenseDTO> all() {
        return expenseService.all();
    }

    @PostMapping("/{id}")
    public Expense newExpense(@RequestBody ExpenseDTO newExpense, @PathVariable Long id) {
        return expenseService.newExpense(newExpense, id);
    }

    @GetMapping("/{id}")
    public Expense one(@PathVariable Long id) {
        return expenseService.one(id);
    }

    @PutMapping("/{id}")
    public Expense replaceExpense(@RequestBody Expense newExpense, @PathVariable Long id) {
        return expenseService.replaceExpense(newExpense, id);
    }

    @GetMapping("/monthly")
    public Map<String, Double> getMonthlyExpenses() {
        return expenseService.getMonthlyExpenses();
    }

    @GetMapping("/category")
    public Map<String, Double> getCategoryExpenses() {
        return expenseService.getCategoryExpenses();
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@RequestBody ExpenseDTO expenseToDelete, @PathVariable Long id) {
        expenseService.deleteExpense(expenseToDelete, id);
    }
}

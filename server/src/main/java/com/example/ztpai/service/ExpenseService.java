package com.example.ztpai.service;

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
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseService {

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
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return username;
    }

    private LocalDateTime getCurrentDate() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        return LocalDateTime.parse(LocalDateTime.now().format(formatter)).withNano(0);
    }

    public List<ExpenseDTO> all() {
        Long userId = userRepository.findByUsername(getUser()).getId();
        List<Expense> expenses = repository.findAllByUserIdAndGroupId(userId, null);
        List<ExpenseDTO> expensesDTO = new ArrayList<>();

        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD);
        if (modelMapper.getTypeMap(Expense.class, ExpenseDTO.class) == null) {
            modelMapper.createTypeMap(Expense.class, ExpenseDTO.class)
                    .addMappings(mapper -> mapper.map(src -> src.getCategory().getName(), ExpenseDTO::setCategory));
        }

        for (Expense expense : expenses) {
            expensesDTO.add(modelMapper.map(expense, ExpenseDTO.class));
        }

        return expensesDTO;
    }

    public Expense newExpense(ExpenseDTO newExpense, Long id) {
        Expense expense = modelMapper.map(newExpense, Expense.class);
        if (id != 0) {
            expense.setGroup(groupRepository.findById(id).orElseThrow(EntityNotFoundException::new));
        }

        expense.setUser(userRepository.findByUsername(getUser()));
        expense.setCategory(categoryRepository.findCategoryByName(newExpense.getCategory()));
        expense.setDate(getCurrentDate());
        return repository.save(expense);
    }

    public Expense one(Long id) {
        return repository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
    }

    public Expense replaceExpense(Expense newExpense, Long id) {
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

    public Map<String, Double> getMonthlyExpenses() {
        Long userId = userRepository.findByUsername(getUser()).getId();
        Map<String, Double> monthlyExpenses = new HashMap<>();
        List<Expense> expenses = repository.findAllByUserIdAndGroupId(userId, null);
        List<YearMonth> dates = new ArrayList<>();
        for (Expense expense : expenses) {
            YearMonth date = YearMonth.from(expense.getDate());
            if (!dates.contains(date)) {
                dates.add(YearMonth.from(date));
            }
        }

        for (YearMonth date : dates) {
            double amount = 0;
            for (Expense expense : expenses) {
                if (YearMonth.from(expense.getDate()).equals(date)) {
                    amount += expense.getAmount();
                }
            }

            monthlyExpenses.put(date.toString(), amount);
        }

        return monthlyExpenses;
    }

    public Map<String, Double> getCategoryExpenses() {
        Long userId = userRepository.findByUsername(getUser()).getId();
        Map<String, Double> categoryExpenses = new HashMap<>();
        List<Expense> expenses = repository.findAllByUserIdAndGroupId(userId, null);
        List<Category> categories = new ArrayList<>();
        for (Expense expense : expenses) {
            Category category = expense.getCategory();
            if (!categories.contains(category)) {
                categories.add(category);
            }
        }

        for (Category category : categories) {
            double amount = 0;
            for (Expense expense : expenses) {
                if (expense.getCategory() == category) {
                    amount += expense.getAmount();
                }
            }
            categoryExpenses.put(category.getName(), amount);
        }

        return categoryExpenses;
    }

    public void deleteExpense(ExpenseDTO expenseToDelete, Long id) {
        Expense expense = modelMapper.map(expenseToDelete, Expense.class);
        if (id != 0) {
            expense.setGroup(groupRepository.findById(id).orElseThrow(EntityNotFoundException::new));
        }

        expense.setUser(userRepository.findByUsername(getUser()));
        expense.setCategory(categoryRepository.findCategoryByName(expenseToDelete.getCategory()));

        Long groupId = null;
        if (expense.getGroup() != null)
            groupId = expense.getGroup().getId();

        Expense expenseDelete = repository.findTopByAmountAndCommentAndUserIdAndGroupIdAndCategoryIdAndCurrencyAndDate(
                expense.getAmount(),
                expense.getComment(),
                expense.getUser().getId(),
                groupId,
                expense.getCategory().getId(),
                expense.getCurrency(),
                expense.getDate()
        );

        repository.delete(expenseDelete);
    }

}

package com.example.ztpai.repository;

import com.example.ztpai.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByUserId(Long userId);
    List<Expense> findAllByGroupId(Long groupId);
    List<Expense> findAllByUserIdAndGroupId(Long userId, Long groupId);
    Expense findByAmountAndCommentAndUserIdAndGroupIdAndCategoryIdAndCurrencyAndDate(
            Double amount,
            String comment,
            Long userId,
            Long groupId,
            Long categoryId,
            String currency,
            LocalDateTime date
    );

}

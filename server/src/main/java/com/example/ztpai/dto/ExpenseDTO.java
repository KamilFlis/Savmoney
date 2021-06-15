package com.example.ztpai.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ExpenseDTO {

    private double amount;
    private String comment;
    private String currency;
    private String category; // category name
    private LocalDateTime date;
    private String username;
}

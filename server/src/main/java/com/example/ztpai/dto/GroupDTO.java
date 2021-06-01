package com.example.ztpai.dto;
import com.example.ztpai.model.Expense;
import com.example.ztpai.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class GroupDTO {

    private String name;
    private String description;

    private Set<User> users;
    private List<Expense> expenses;
}

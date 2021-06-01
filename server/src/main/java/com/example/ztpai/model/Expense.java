package com.example.ztpai.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class, property="@id")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonBackReference(value = "users")
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id")
    @JsonBackReference(value = "groups")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference(value = "categories")
    private Category category;

    private double amount;
    private String currency;
    private String comment;

    private LocalDateTime date;

}

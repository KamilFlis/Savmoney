package com.example.ztpai.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class, property="@id")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String firstname;

    @NotNull
    private String lastname;

    @NotNull
    private String email;

    @NotNull
    private String username;

    @NotNull
    private String password;

    @Transient
    private String passwordConfirm;

    @ManyToMany
    private Set<Role> roles;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "user", cascade = CascadeType.DETACH)
    @JsonManagedReference(value = "users")
    private List<Expense> expenses;

    @ManyToMany(mappedBy = "users")
    private List<Group> groups;

}

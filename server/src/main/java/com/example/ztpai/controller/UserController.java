package com.example.ztpai.controller;

import com.example.ztpai.model.Expense;
import com.example.ztpai.model.User;
import com.example.ztpai.repository.UserRepository;
import com.example.ztpai.service.UserService;
import com.example.ztpai.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserValidator userValidator;

    @PostMapping("/api/register")
    @CrossOrigin(origins = "http://localhost:3000")
    void register(@RequestBody User user, BindingResult bindingResult) {
//        user.setExpenses(new HashSet<Expense>());
        userValidator.validate(user, bindingResult);

        if(bindingResult.hasErrors()) {
            System.out.println("Errors while registering");
            return;
        }

        userService.save(user);
    }

    @PostMapping("/api/update")
    @CrossOrigin(origins = "http://localhost:3000")
    void update(@RequestBody User user) {
        userService.update(user);
    }

}

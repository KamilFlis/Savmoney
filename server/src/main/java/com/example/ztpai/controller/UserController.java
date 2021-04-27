package com.example.ztpai.controller;

import com.example.ztpai.model.User;
//import com.example.ztpai.service.SecurityService;
import com.example.ztpai.service.UserService;
import com.example.ztpai.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
//@RequestMapping("/api/users")
//@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;
//    @Autowired
//    private SecurityService securityService;
    @Autowired
    private UserValidator userValidator;

    @PostMapping("/api/register")
    @CrossOrigin(origins = "http://localhost:3000")
    void register(@RequestBody User user, BindingResult bindingResult) {
        System.out.println("registering!");
        userValidator.validate(user, bindingResult);

        if(bindingResult.hasErrors()) {
            System.out.println("Erorrs while registering");
            return;
        }

        userService.save(user);
//        securityService.autoLogin(user.getUsername(), user.getPasswordConfirm());
    }

//    @PostMapping("/api/login")
//    @CrossOrigin(origins = "http://localhost:3000")
//    void login(@RequestBody User user) {
//
//    }

}

package com.example.ztpai.controller;

import com.example.ztpai.dto.UserDTO;
import com.example.ztpai.model.User;
import com.example.ztpai.repository.UserRepository;
import com.example.ztpai.service.UserService;
import com.example.ztpai.validator.UserValidator;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserValidator userValidator;

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

    @PostMapping("/api/register")
    void register(@RequestBody User user, BindingResult bindingResult) {
        userValidator.validate(user, bindingResult);
        if (bindingResult.hasErrors()) {
            System.out.println("Errors while registering");
            throw new BadCredentialsException("Wrong credentials");
        }
        userService.save(user);
    }

    @PostMapping("/api/update")
    void update(@RequestBody User user) {
        userService.update(user);
    }

    @GetMapping("/api/me")
    UserDTO getUserDetails() {
        User user = userRepository.findByUsername(getUser());
        return modelMapper.map(user, UserDTO.class);
    }

    @PostMapping("/api/changePassword")
    void changePassword(@RequestBody User user) {
        User actualUser = userRepository.findByUsername(getUser());
        userService.changePassword(actualUser, user.getPassword());
    }

}

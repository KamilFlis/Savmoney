package com.example.ztpai.controller;

import com.example.ztpai.dto.ExpenseDTO;
import com.example.ztpai.dto.GroupDTO;
import com.example.ztpai.dto.UserDTO;
import com.example.ztpai.model.Expense;
import com.example.ztpai.model.Group;
import com.example.ztpai.model.User;
import com.example.ztpai.repository.ExpenseRepository;
import com.example.ztpai.repository.GroupRepository;
import com.example.ztpai.repository.UserRepository;
import com.example.ztpai.service.UserService;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    private String getUser() {
        String username;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }
        return username;
    }

    @GetMapping("/")
    @CrossOrigin("http://localhost:3000")
    List<Group> all() {
       String username = getUser();
       User user = userService.findByUsername(username);
       return user.getGroups();
    }

    @PostMapping("/")
    @CrossOrigin("http://localhost:3000")
    Group newGroup(@RequestBody GroupDTO newGroup) {
        Set<User> users = new HashSet<>();
        users.add(userRepository.findByUsername(this.getUser()));
        newGroup.setUsers(users);
        Group group = modelMapper.map(newGroup, Group.class);
        return groupRepository.save(group);
    }

    @GetMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:3000")
    Group one(@PathVariable Long id) {
        return groupRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
    }

    @GetMapping("/{id}/users")
    @CrossOrigin(origins = "http://localhost:3000")
    Set<UserDTO> groupUsers(@PathVariable Long id) {
        if(modelMapper.getTypeMap(User.class, UserDTO.class) == null) {
            modelMapper.createTypeMap(User.class, UserDTO.class)
                    .addMappings(mapper -> mapper.map(User::getUsername, UserDTO::setUsername));
        }

        Set<User> users = groupRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new)
                .getUsers();

        Set<UserDTO> usersDTO = new HashSet<>();
        for(User user: users) {
            usersDTO.add(modelMapper.map(user, UserDTO.class));
        }

        return usersDTO;
    }

    @PostMapping("/{id}/users/add")
    @CrossOrigin("http://localhost:3000")
    void addUser(@RequestBody User user, @PathVariable Long id) {
        User foundUser = userService.findByUsername(user.getUsername());
        Group group = groupRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);

        group.getUsers().add(foundUser);
        groupRepository.save(group);
    }

    @GetMapping("/{id}/expenses")
    List<ExpenseDTO> groupExpenses(@PathVariable Long id) {
        List<Expense> expenses = expenseRepository.findAllByGroupId(id);
        List<ExpenseDTO> expenseDTO = new ArrayList<>();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);
        for(Expense expense: expenses) {
            expenseDTO.add(modelMapper.map(expense, ExpenseDTO.class));
        }

        return expenseDTO;
    }
}
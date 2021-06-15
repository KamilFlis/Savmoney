package com.example.ztpai.service;

import com.example.ztpai.dto.ExpenseDTO;
import com.example.ztpai.dto.GroupDTO;
import com.example.ztpai.dto.UserDTO;
import com.example.ztpai.model.Expense;
import com.example.ztpai.model.Group;
import com.example.ztpai.model.User;
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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class GroupService {

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
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return username;
    }

    public List<Group> all() {
        String username = getUser();
        User user = userService.findByUsername(username);
        return user.getGroups();
    }

    public Group newGroup(GroupDTO newGroup) {
        Set<User> users = new HashSet<>();
        users.add(userRepository.findByUsername(this.getUser()));
        newGroup.setUsers(users);
        Group group = modelMapper.map(newGroup, Group.class);
        return groupRepository.save(group);
    }

    public Group one(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
    }

    public Set<UserDTO> groupUsers(Long id) {
        if (modelMapper.getTypeMap(User.class, UserDTO.class) == null) {
            modelMapper.createTypeMap(User.class, UserDTO.class)
                    .addMappings(mapper -> mapper.map(User::getUsername, UserDTO::setUsername));
        }

        Set<User> users = groupRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new)
                .getUsers();

        Set<UserDTO> usersDTO = new HashSet<>();
        for (User user : users) {
            usersDTO.add(modelMapper.map(user, UserDTO.class));
        }

        return usersDTO;
    }

    public void addUser(User user, Long id) {
        User foundUser = userService.findByUsername(user.getUsername());
        Group group = groupRepository.findById(id).orElseThrow(EntityNotFoundException::new);

        group.getUsers().add(foundUser);
        groupRepository.save(group);
    }

    public List<ExpenseDTO> groupExpenses(Long id) {
        List<Expense> expenses = expenseRepository.findAllByGroupId(id);
        List<ExpenseDTO> expenseDTO = new ArrayList<>();

        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD);
        if (modelMapper.getTypeMap(Expense.class, ExpenseDTO.class) == null) {
            modelMapper.createTypeMap(Expense.class, ExpenseDTO.class)
                    .addMappings(mapper -> mapper.map(src -> src.getCategory().getName(), ExpenseDTO::setCategory))
                    .addMappings(mapper -> mapper.map(src -> src.getUser().getUsername(), ExpenseDTO::setUsername));
        }

        for (Expense expense : expenses) {
//            System.out.println(expense.getUser().getUsername());
            expenseDTO.add(modelMapper.map(expense, ExpenseDTO.class));
        }

        return expenseDTO;
    }
}

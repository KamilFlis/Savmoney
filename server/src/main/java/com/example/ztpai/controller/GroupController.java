package com.example.ztpai.controller;

import com.example.ztpai.dto.ExpenseDTO;
import com.example.ztpai.dto.GroupDTO;
import com.example.ztpai.dto.UserDTO;
import com.example.ztpai.model.Group;
import com.example.ztpai.model.User;
import com.example.ztpai.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @GetMapping("/")
    public List<Group> all() {
        return groupService.all();
    }

    @PostMapping("/")
    public Group newGroup(@RequestBody GroupDTO newGroup) {
        return groupService.newGroup(newGroup);
    }

    @GetMapping("/{id}")
    public Group one(@PathVariable Long id) {
        return groupService.one(id);
    }

    @GetMapping("/{id}/users")
    public Set<UserDTO> groupUsers(@PathVariable Long id) {
        return groupService.groupUsers(id);
    }

    @PutMapping("/{id}/users/add")
    public void addUser(@RequestBody User user, @PathVariable Long id) {
        groupService.addUser(user, id);
    }

    @GetMapping("/{id}/expenses")
    public List<ExpenseDTO> groupExpenses(@PathVariable Long id) {
        return groupService.groupExpenses(id);
    }
}
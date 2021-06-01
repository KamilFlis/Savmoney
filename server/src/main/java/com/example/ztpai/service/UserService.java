package com.example.ztpai.service;

import com.example.ztpai.model.User;

public interface UserService {

    void save(User user);
    void update(User user);

    User findByUsername(String username);

}

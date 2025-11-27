package com.clothify.userservice.controller;

import com.clothify.userservice.entity.User;
import com.clothify.userservice.service.UserService;
import com.clothify.userservice.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final MailService mailService;

    @Autowired
    public UserController(UserService userService, MailService mailService) {
        this.userService = userService;
        this.mailService = mailService;
    }

    @GetMapping("")
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> resp = new HashMap<>();
        if (user.getConfirmPassword() != null && !user.getConfirmPassword().equals(user.getPassword())) {
            resp.put("status", "error");
            resp.put("message", "Passwords do not match");
            return resp;
        }
        try {
            User u = userService.register(user);
            try {
                mailService.sendMail(u.getEmail(), "Welcome to Clothify",
                        "Hello " + u.getName() + ", thanks for registering.");
            } catch (Exception e) {

            }
            resp.put("status", "success");
            resp.put("user", u);
            return resp;
        } catch (Exception e) {
            resp.put("status", "error");
            resp.put("message", e.getMessage());
            return resp;
        }
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> payload) {
        Map<String, Object> resp = new HashMap<>();
        String email = payload.get("email");
        String pwd = payload.get("password");
        Optional<User> u = userService.login(email, pwd);
        if (u.isPresent()) {
            resp.put("status", "success");
            resp.put("user", u.get());
        } else {
            resp.put("status", "error");
            resp.put("message", "Invalid email or password");
        }
        return resp;
    }
}

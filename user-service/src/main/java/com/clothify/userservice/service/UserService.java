package com.clothify.userservice.service;

import com.clothify.userservice.entity.User;
import com.clothify.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;

    @Autowired
    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return repo.findById(id);
    }

    public User register(User user) {
        Optional<User> existing = repo.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        user.setPassword(user.getPassword());
        return repo.save(user);
    }

    public Optional<User> login(String email, String password) {
        Optional<User> u = repo.findByEmail(email);
        if (u.isPresent() && u.get().getPassword().equals(password)) {
            return u;
        }
        return Optional.empty();
    }
}

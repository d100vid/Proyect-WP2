package com.projectapp.controller;

import com.projectapp.model.User;
import com.projectapp.repository.UserRepository;
import com.projectapp.service.UserService;
import com.projectapp.dto.LoginRequest;
import com.projectapp.dto.SignUpRequest;
import com.projectapp.dto.AuthResponse;
import com.projectapp.dto.UserResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignUpRequest request) {
        try {
            User user = userService.register(request.getName(), request.getEmail(), request.getPassword(), request.getRole());
            UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
            AuthResponse response = new AuthResponse(true, "Registration successful", userResponse);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(false, e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
            AuthResponse response = new AuthResponse(true, "Login successful", userResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(false, e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}


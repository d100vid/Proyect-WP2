package com.projectapp.service;

import com.projectapp.model.User;
import com.projectapp.repository.UserRepository;
import com.projectapp.util.PasswordUtil;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String name, String email, String password, String role) throws Exception {
        // Validar que el email no exista
        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("Email already registered");
        }

        // Validar contraseña
        if (password == null || password.length() < 6) {
            throw new Exception("Password must be at least 6 characters");
        }

        // Validar nombre
        if (name == null || name.trim().isEmpty()) {
            throw new Exception("Name is required");
        }

        // Validar rol
        if (role == null || (!role.equals("User") && !role.equals("Admin"))) {
            throw new Exception("Invalid role. Must be 'User' or 'Admin'");
        }

        // Crear nuevo usuario con contraseña encriptada
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(PasswordUtil.encodePassword(password));
        user.setRole(role);

        return userRepository.save(user);
    }

    public User login(String email, String password) throws Exception {
        // Buscar usuario por email
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();

        // Validar contraseña
        if (!PasswordUtil.verifyPassword(password, user.getPassword())) {
            throw new Exception("Invalid password");
        }

        return user;
    }
}

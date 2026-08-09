package com.example.lostfound.controller;

import com.example.lostfound.model.User;
import com.example.lostfound.repository.UserRepository;
import com.example.lostfound.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,PasswordEncoder passwordEncoder,JwtService jwtService) {
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.jwtService=jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if(!user.getEmail().endsWith("@vitstudent.ac.in")) {
            return ResponseEntity.badRequest()
                    .body("Only VIT student emails are allowed");
        }

        if(userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser=userRepository.save(user);

        savedUser.setPassword(null);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User existingUser=userRepository.findByEmail(user.getEmail())
                .orElse(null);

        if(existingUser==null) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        if(!passwordEncoder.matches(user.getPassword(),existingUser.getPassword())) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        String token=jwtService.generateToken(existingUser.getEmail());

        return ResponseEntity.ok(new LoginResponse(
                token,
                existingUser.getUsername(),
                existingUser.getEmail()
        ));
    }

    public record LoginResponse(
            String token,
            String username,
            String email
    ) {}
}
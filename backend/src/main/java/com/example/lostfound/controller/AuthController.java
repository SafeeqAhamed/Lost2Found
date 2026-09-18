package com.example.lostfound.controller;
import com.example.lostfound.model.User; // User model → represents the user data
import com.example.lostfound.repository.UserRepository; // Repository → used to communicate with MongoDB database
import com.example.lostfound.security.JwtService; // JwtService → used to generate JWT token after successful login
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // PasswordEncoder → used to hash passwords and check passwords securely
import org.springframework.web.bind.annotation.*;

//@RestController → This class handles API requests and automatically sends responses
@RestController

//@RequestMapping → Common starting URL for all APIs in this controller
@RequestMapping("/api/auth")

public class AuthController {

    //Used to find, save, and check users in the database
    private final UserRepository userRepository;

    //Used to encrypt password and later compare password with encrypted password
    private final PasswordEncoder passwordEncoder;

    //Used to generate JWT token after login
    private final JwtService jwtService;


    //Constructor → Spring provides these required dependencies automatically
    public AuthController(UserRepository userRepository,PasswordEncoder passwordEncoder,JwtService jwtService) {
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
        this.jwtService=jwtService;
    }


    //___________________________________________________________________________________________

    //POST request → /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        //@RequestBody → Takes user data sent from frontend and converts it into User object


        //Check whether the email belongs to a VIT student
        if(!user.getEmail().endsWith("@vitstudent.ac.in")) 
            { return ResponseEntity.badRequest().body("Only VIT student emails are allowed"); }
        

        //Check whether this email is already registered in the database
        if(userRepository.existsByEmail(user.getEmail())) 
                {return ResponseEntity.badRequest().body("Email already registered");}
        

        //Hash/encrypt the password before saving it in the database
        //Never store the original password directly
        user.setPassword(passwordEncoder.encode(user.getPassword()));


        //Save the new user in MongoDB
        User savedUser=userRepository.save(user);


        //Remove password from the response before sending user data to frontend
        //So the hashed password is not exposed
        savedUser.setPassword(null);


        //Registration successful → Send saved user data with HTTP status 200
        return ResponseEntity.ok(savedUser);
    }


    //___________________________________________________________________________________________

    //POST request → /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        //Find the user using the email received from the frontend
        //If user is not found → return null
        User existingUser=userRepository.findByEmail(user.getEmail())
                                        .orElse(null);


        //If no user exists with this email → login failed
        if(existingUser==null) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }


        //Compare the password entered by the user with the hashed password in database
        //matches() handles the hashing comparison securely
        if(!passwordEncoder.matches(user.getPassword(),existingUser.getPassword())) {  //hash and match
            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }


        //Email and password are correct → generate JWT token
        //Token will be used later to prove that the user is logged in
        String token=jwtService.generateToken(existingUser.getEmail());


        //Login successful → Send token and user details back to the frontend
        return ResponseEntity.ok(new LoginResponse(
                token,
                existingUser.getUsername(),
                existingUser.getEmail()
        ));
    }


    //___________________________________________________________________________________________

    //LoginResponse → Defines the data that should be sent to frontend after successful login
    //Spring Boot automatically converts this record into JSON
    public record LoginResponse(
            String token,       //JWT token → used for authentication
            String username,    //Logged-in user's username
            String email        //Logged-in user's email
    ) {}
}
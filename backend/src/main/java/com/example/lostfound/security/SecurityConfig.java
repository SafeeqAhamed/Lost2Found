package com.example.lostfound.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration                  // Tells Spring this class contains configuration
@EnableWebSecurity               // Enables Spring Security
public class SecurityConfig {

    // Our custom JWT filter
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Spring gives us the JWT filter object
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter=jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                // Enable CORS and use our CORS configuration below
                //CSRF = Cross-Site Request Forgery. -mali website send request to backend
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disable CSRF because we are using JWT authentication instead of session
                .csrf(csrf -> csrf.disable())

                // Make the application STATELESS
                // Server will not maintain login sessions
                // JWT must be sent with each protected request
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Define which requests are allowed or protected
                .authorizeHttpRequests(auth -> auth

                        // LOGIN is PUBLIC
                        // User does not have JWT yet
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login"
                        ).permitAll()

                        // REGISTER is PUBLIC
                        // New user does not have JWT yet
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/register"
                        ).permitAll()

                        // OPTIONS requests are PUBLIC
                        // Browser uses OPTIONS for CORS preflight
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Every other API requires authentication
                        // User must have a valid JWT
                        .anyRequest().authenticated()
                )

                // What happens when authentication fails
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(
                                (request,response,authException) -> {

                                    // Send HTTP 401 Unauthorized
                                    // when user is not authenticated
                                    response.setStatus(
                                            HttpServletResponse.SC_UNAUTHORIZED
                                    );
                                }
                        )
                )

                // Run our JWT filter BEFORE
                // Spring's UsernamePasswordAuthenticationFilter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        // Build and return the complete security filter chain
        return http.build();
    }


    // =========================
    // CORS CONFIGURATION
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        // Create CORS configuration object
        CorsConfiguration configuration=new CorsConfiguration();

        // Allow requests from these frontend URLs
        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:5174"
                )
        );

        // Allow these HTTP methods
        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        // Allow all request headers
        // Example: Authorization, Content-Type, etc.
        configuration.setAllowedHeaders(
                List.of("*")
        );

        // Allow credentials in cross-origin requests
        configuration.setAllowCredentials(true);

        // Create CORS configuration source
        UrlBasedCorsConfigurationSource source=
                new UrlBasedCorsConfigurationSource();

        // Apply the CORS rules to all URLs
        // /** means every endpoint
        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // =========================
    // PASSWORD ENCODER
    // =========================

    @Bean
    public PasswordEncoder passwordEncoder() {

        // BCrypt securely hashes user passwords
        // Password is NOT stored as plain text in database
        return new BCryptPasswordEncoder();
    }
}
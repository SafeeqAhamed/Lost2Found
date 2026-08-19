package com.example.lostfound.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secret;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path=request.getServletPath();
                                                   //OPTIONS /api/auth/login (browser asking permission before making the real request)
        return request.getMethod().equalsIgnoreCase("OPTIONS")   //skips the filter for-coz u dont have jwt yet
                || path.equals("/api/auth/login")
                || path.equals("/api/auth/register");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException,IOException {

        String authHeader=request.getHeader("Authorization");

        if(authHeader==null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request,response); //done with this filte
            return;                               // Pass the request to the next filter/controller."
        }

        String token=authHeader.substring(7);

        try {

            SecretKey key=Keys.hmacShaKeyFor(
                    secret.getBytes(StandardCharsets.UTF_8)
            );

            String email=Jwts.parser()
                    .verifyWith(key)    //Is the token valid? & Was it created using our secret key?
                    .build()
                    .parseSignedClaims(token)   //Has it been modified/invalid?
                    .getPayload()
                    .getSubject();

            UsernamePasswordAuthenticationToken authentication=
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.emptyList()  //What roles/permissions does user have?
                    );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

        } catch(Exception e) {

            System.out.println(
                    "Invalid JWT token: "+e.getMessage()
            );

        }

        filterChain.doFilter(request,response);
    }
}
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


    //Skip JWT checking
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path=request.getServletPath();

        return path.equals("/api/auth/login") //because the user doesn't have a token yet.
                || path.equals("/api/auth/register")  //because the user is creating an account.
                || request.getMethod().equalsIgnoreCase("OPTIONS"); //because it is usually a CORS preflight request.
    }
    //Request varuthu athula irunthu token ah eduthu check panrom
    //valid na Security Context Holder la attach panirurom
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException,IOException {
        
        //Request odaya head la Token edukrom
        String authHeader=request.getHeader("Authorization"); //Authorization: Bearer eyJhbGci...
        
        // If Authorization header is missing or doesn't contain "Bearer <token>"
        if(authHeader==null || !authHeader.startsWith("Bearer "))  
                {filterChain.doFilter(request,response);  //let request go to next filter
                return;//no need to execute below codes
                }

        String token=authHeader.substring(7); //Remove Bearer

        try {

            SecretKey key=Keys.hmacShaKeyFor(
                    secret.getBytes(StandardCharsets.UTF_8)
            );

            String email=Jwts.parser()
                    .verifyWith(key) //key to verify the JWT's signature.
                    .build()  // Build the JWT parser.
                    .parseSignedClaims(token)   //sign matched amd gives Claims(info in token)
                                               //throws an exception if the token's signature doesn't match the provided key.
                    .getPayload()   //get subject from payload
                    .getSubject();  

            UsernamePasswordAuthenticationToken authentication=
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,  // No password/credentials as authentication is already established.
                            Collections.emptyList() //empty list of authorities/roles for this authentication.
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch(Exception e) {
                     System.out.println( "Invalid JWT token: "+e.getMessage());
                            }

        filterChain.doFilter(request,response);
    }
}
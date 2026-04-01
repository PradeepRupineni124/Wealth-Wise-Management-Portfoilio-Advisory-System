package com.wealth.client.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders; // Import this
import io.jsonwebtoken.security.Keys; // Import this
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
public class JwtUtil {

    @Value("${application.security.jwt.secret-key}")
    private String SECRET_KEY;

    public Long extractAdvisorId(String token) {
        // 1. Strip the "Bearer " prefix
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 2. Parse the token using the SAME decoding logic as Auth Service
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignInKey()) // Use the helper method
                .build()
                .parseClaimsJws(token)
                .getBody();

        // 3. Extract the ID.
        // WARNING: Ensure your Auth Service actually put the ID (e.g., "101")
        // in the subject. If it put an email ("john@test.com"), this will crash.
        return claims.get("advisorId", Long.class);
    }

    // Helper method to ensure identical key generation
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
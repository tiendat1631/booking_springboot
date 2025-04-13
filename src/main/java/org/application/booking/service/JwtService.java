package org.application.booking.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.application.booking.Entity.User;
import org.application.booking.config.JwtConfig;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
@RequiredArgsConstructor
public class JwtService {
    // Secret key phải là base64, nên bạn cần encode trước
   private final JwtConfig jwtConfig;
   
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());

        return Jwts.builder()
                .setClaims(claims) // đưa claims (là payload) vào trong token.
                .setSubject(user.getId().toString())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 1 ngày
                .signWith(getKey())
                .compact();
    }

    // chuyen doi secretKey dang String sang Key de xac thục JWT
    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                Base64.getEncoder().encodeToString(jwtConfig.getSecretKey().getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

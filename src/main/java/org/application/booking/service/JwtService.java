package org.application.booking.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.application.booking.configure.JwtConfiguration;
import org.application.booking.domain.entity.User;

import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class JwtService {
    // Secret key phải là base64, nên bạn cần encode trước
   private final JwtConfiguration jwtConfig;
   
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());

        return Jwts.builder()
                .setClaims(claims) // đưa claims (là payload) vào trong token.
                .setSubject(user.getId().toString())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration())) // 1 ngày
                .signWith(getKey())
                .compact();
    }

    // chuyen doi secretKey dang String sang Key de xac thục JWT
    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                Base64.getEncoder().encodeToString(jwtConfig.getSecretkey().getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(getKey())// sử dụng secret key bạn đã dùng để ký token
                    .build()
                    .parseClaimsJws(token);// nếu token hợp lệ, dòng này sẽ chạy ok

            return true;
        } catch (Exception e) {
            return false;// Token sai, hết hạn, hoặc không giải mã được
        }
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                // giai ma token
                .setSigningKey(getKey())
                .build()
                //lấy phần body (payload)
                .parseClaimsJws(token)
                .getBody()
                //subject chính là iduser bạn đã gán
                .getSubject();
    }
}

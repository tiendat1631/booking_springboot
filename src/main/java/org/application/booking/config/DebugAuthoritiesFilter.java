package org.application.booking.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class DebugAuthoritiesFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            System.out.println(">>> DEBUG Authentication: " + authentication.getName());
            System.out.println(">>> DEBUG Authorities:");
            authentication.getAuthorities()
                    .forEach(a -> System.out.println(" - " + a.getAuthority()));
        } else {
            System.out.println(">>> DEBUG Authentication: null");
        }

        filterChain.doFilter(request, response);
    }
}

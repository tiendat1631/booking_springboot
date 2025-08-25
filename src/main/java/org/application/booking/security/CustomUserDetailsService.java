package org.application.booking.security;

import lombok.RequiredArgsConstructor;
import org.application.booking.domain.aggregates.UserModel.User;
import org.application.booking.domain.aggregates.UserModel.Username;
import org.application.booking.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Component("userDetailsService")
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(Username.CreateUsername(username))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new UserPrinciple(user);
    }
}

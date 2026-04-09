package org.example.lost_and_found.service;

import lombok.RequiredArgsConstructor;
import org.example.lost_and_found.entity.User;
import org.example.lost_and_found.repository.UserRepository;
import org.example.lost_and_found.security.CustomUserDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user=userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("User Not found"));
        return new CustomUserDetails(user);
    }

}

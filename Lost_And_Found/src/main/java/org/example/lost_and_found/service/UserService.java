package org.example.lost_and_found.service;

import lombok.RequiredArgsConstructor;
import org.example.lost_and_found.dto.LoginRequest;
import org.example.lost_and_found.dto.SignupRequest;
import org.example.lost_and_found.entity.Role;
import org.example.lost_and_found.entity.User;
import org.example.lost_and_found.repository.UserRepository;
import org.example.lost_and_found.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    public final UserRepository usesRepository;
    public final PasswordEncoder passwordEncoder;
    public final JwtUtil jwtUtil;
    public void signup(SignupRequest request){
        if(usesRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("Email already exists");
        }
        User user= new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(Role.USER);
        usesRepository.save(user);
    }

    public String login(LoginRequest request){
     User user=usesRepository.findByEmail(request.getEmail()).orElseThrow(()->new RuntimeException("User not found"));
     if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
         throw new RuntimeException("Wrong password");
     }
     return jwtUtil.generateToken(user.getEmail());

    }
}

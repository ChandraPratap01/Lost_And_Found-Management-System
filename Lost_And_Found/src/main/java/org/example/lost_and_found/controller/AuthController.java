package org.example.lost_and_found.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.lost_and_found.dto.LoginRequest;
import org.example.lost_and_found.dto.SignupRequest;
import org.example.lost_and_found.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    @PostMapping("/signup")
    public ResponseEntity<?> signup( @Valid  @RequestBody SignupRequest request){
        userService.signup(request);
        return ResponseEntity.ok("User Registered");
    }
   @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
      String token=userService.login(request);
      return ResponseEntity.ok(token);
    }
}

package org.example.lost_and_found.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}

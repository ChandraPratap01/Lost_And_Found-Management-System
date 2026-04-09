package org.example.lost_and_found.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Claim {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Item item;
    @ManyToOne
    private User user;
    @Enumerated(EnumType.STRING)
    private ClaimStatus status;
    private LocalDateTime createdAt;



}

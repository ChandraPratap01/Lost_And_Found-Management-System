package org.example.lost_and_found.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;
    private String description;
    private String category;
    @Enumerated(EnumType.STRING)
    private ItemStatus status;
    private String location;
    private String imageUrl;
    private boolean claimed;
    @ManyToOne
    private User user;
    private LocalDateTime createAt;


}

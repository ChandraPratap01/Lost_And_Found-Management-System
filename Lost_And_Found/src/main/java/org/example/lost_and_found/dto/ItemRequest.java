package org.example.lost_and_found.dto;

import lombok.Data;

@Data
public class ItemRequest {
  private String tittle;
  private String description;
  private String category;
  private String status;
  private String location;
  private String imageUrl;


}

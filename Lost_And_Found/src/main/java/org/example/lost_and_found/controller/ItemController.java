package org.example.lost_and_found.controller;


import lombok.RequiredArgsConstructor;
import org.example.lost_and_found.dto.ApiResponse;
import org.example.lost_and_found.dto.ItemRequest;
import org.example.lost_and_found.entity.Item;
import org.example.lost_and_found.service.ItemService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;
    @PostMapping
    public ResponseEntity<?>createItem(@RequestBody ItemRequest request, Authentication authentication){
        String email=authentication.getName();
        Item item=itemService.createItem(request,email);
        return ResponseEntity.ok(new ApiResponse<>("Item Created",item));
    }

    @GetMapping
    public Page<Item> getAllItems(@RequestParam(defaultValue = "0") int page,@RequestParam(defaultValue = "10") int size){
        return itemService.getAllItems(page,size);
    }

    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id){
        return itemService.getItemById(id);
    }
}

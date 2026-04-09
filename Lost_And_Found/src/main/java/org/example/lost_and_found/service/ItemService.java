package org.example.lost_and_found.service;

import lombok.RequiredArgsConstructor;
import org.example.lost_and_found.dto.ItemRequest;
import org.example.lost_and_found.entity.Item;
import org.example.lost_and_found.entity.ItemStatus;
import org.example.lost_and_found.entity.User;
import org.example.lost_and_found.repository.ItemRepository;
import org.example.lost_and_found.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    public Item createItem(ItemRequest request,String email){
        User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("user not found"));
        Item item=new Item();
        item.setTitle(request.getTittle());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setStatus(ItemStatus.valueOf(request.getStatus()));
        item.setLocation(request.getLocation());
        item.setImageUrl(request.getImageUrl());
        item.setUser(user);
        item.setCreateAt(LocalDateTime.now());
        return itemRepository.save(item);
    }

    public Page<Item> getAllItems(int page, int size){
        return itemRepository.findAll(PageRequest.of(page, size));
    }

    public Item getItemById(Long id){
        return itemRepository.findById(id).orElseThrow(()->new RuntimeException("item not found"));
    }
}

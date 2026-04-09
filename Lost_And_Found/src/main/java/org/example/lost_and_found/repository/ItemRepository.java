package org.example.lost_and_found.repository;

import org.example.lost_and_found.entity.Item;
import org.example.lost_and_found.entity.ItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    Page<Item> findAll(Pageable pageable);
    List<Item> findByStatus(ItemStatus status);
}

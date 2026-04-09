package org.example.lost_and_found.repository;

import org.example.lost_and_found.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim,Long> {
    List<Claim> findByItemId(Long itemId);
}

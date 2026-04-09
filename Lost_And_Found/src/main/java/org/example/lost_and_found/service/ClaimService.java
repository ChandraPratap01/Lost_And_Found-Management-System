package org.example.lost_and_found.service;


import lombok.RequiredArgsConstructor;
import org.example.lost_and_found.entity.Claim;
import org.example.lost_and_found.entity.ClaimStatus;
import org.example.lost_and_found.entity.Item;
import org.example.lost_and_found.entity.User;
import org.example.lost_and_found.repository.ClaimRepository;
import org.example.lost_and_found.repository.ItemRepository;
import org.example.lost_and_found.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor

public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    public Claim createClaim(Long Itemid,String email){
        User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("user not found"));
        Item item=itemRepository.findById(Itemid).orElseThrow(()->new RuntimeException("item not found"));
        if(item.isClaimed()){
            throw new RuntimeException("Item has already been claimed");
        }
        Claim claim=new Claim();
        claim.setItem(item);
        claim.setUser(user);
        claim.setStatus(ClaimStatus.PENDING);
        claim.setCreatedAt(LocalDateTime.now());
        return claimRepository.save(claim);
    }

    public Claim approveClaim(Long Itemid,String email){
        Claim claim=claimRepository.findById(Itemid).orElseThrow(()->new RuntimeException("claim not found"));
        if(!claim.getItem().getUser().getEmail().equals(email)){
            throw new RuntimeException("Not authorized");
        }
        if(claim.getItem().isClaimed() && claim.getStatus() != ClaimStatus.APPROVED){
            throw new RuntimeException("Item has already been claimed");
        }
        claim.setStatus(ClaimStatus.APPROVED);
        Item item = claim.getItem();
        item.setClaimed(true);
        itemRepository.save(item);
        return claimRepository.save(claim);
    }

    public Claim rejectClaim(Long claimId, String email) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        if (!claim.getItem().getUser().getEmail().equals(email)) {
            throw new RuntimeException("Not authorized");
        }

        claim.setStatus(ClaimStatus.REJECTED);
        return claimRepository.save(claim);
    }
}

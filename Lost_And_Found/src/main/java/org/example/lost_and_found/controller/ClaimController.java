package org.example.lost_and_found.controller;


import lombok.RequiredArgsConstructor;
import org.example.lost_and_found.dto.ClaimRequest;
import org.example.lost_and_found.entity.Claim;
import org.example.lost_and_found.repository.ClaimRepository;
import org.example.lost_and_found.service.ClaimService;
import org.springframework.cglib.core.ClassInfo;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/claims")
public class ClaimController {
    private final ClaimService claimService;
    @PostMapping
    public Claim createclaim(@RequestBody ClaimRequest Request, Authentication auth){
        return claimService.createClaim(Request.getItemId(), auth.getName());
    }

    @PutMapping("/{id}/approve")
    public Claim approve(@PathVariable Long id, Authentication auth){
        return claimService.approveClaim(id, auth.getName());
    }

    @PutMapping("/{id}/reject")
    public Claim reject(@PathVariable Long id, Authentication auth){
        return claimService.rejectClaim(id, auth.getName());
    }


}

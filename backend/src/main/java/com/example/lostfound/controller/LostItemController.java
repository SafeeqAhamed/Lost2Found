package com.example.lostfound.controller;

import com.example.lostfound.model.LostItem;
import com.example.lostfound.model.User;
import com.example.lostfound.repository.LostItemRepository;
import com.example.lostfound.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lost")
@CrossOrigin(origins="*")
public class LostItemController {

    private final LostItemRepository lostItemRepository;
    private final UserRepository userRepository;

    public LostItemController(LostItemRepository lostItemRepository,UserRepository userRepository) {
        this.lostItemRepository=lostItemRepository;
        this.userRepository=userRepository;
    }

    @PostMapping
    public ResponseEntity<LostItem> addLostItem(
            @RequestBody LostItem item,
            Authentication authentication) {

        String email=authentication.getName();

        User user=userRepository.findByEmail(email).orElse(null);

        if(user==null) {
            return ResponseEntity.status(401).build();
        }

        item.setUsername(user.getUsername());
        item.setEmail(user.getEmail());

        LostItem savedItem=lostItemRepository.save(item);

        return ResponseEntity.ok(savedItem);
    }

    @GetMapping
    public ResponseEntity<List<LostItem>> getLostItems() {

        List<LostItem> items=lostItemRepository.findAll();

        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLostItem(
            @PathVariable String id,
            Authentication authentication) {

        LostItem item=lostItemRepository.findById(id).orElse(null);

        if(item==null) {
            return ResponseEntity.notFound().build();
        }

        String loggedInEmail=authentication.getName();

        if(!item.getEmail().equals(loggedInEmail)) {
            return ResponseEntity.status(403)
                    .body("You can only delete your own lost items");
        }

        lostItemRepository.deleteById(id);

        return ResponseEntity.ok("Lost item deleted successfully");
    }
}
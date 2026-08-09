package com.example.lostfound.controller;

import com.example.lostfound.model.FoundItem;
import com.example.lostfound.model.User;
import com.example.lostfound.repository.FoundItemRepository;
import com.example.lostfound.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/found")
@CrossOrigin(origins="*")
public class FoundItemController {

    private final FoundItemRepository foundItemRepository;
    private final UserRepository userRepository;

    public FoundItemController(FoundItemRepository foundItemRepository,UserRepository userRepository) {
        this.foundItemRepository=foundItemRepository;
        this.userRepository=userRepository;
    }

    @PostMapping
    public ResponseEntity<FoundItem> addFoundItem(
            @RequestBody FoundItem item,
            Authentication authentication) {

        String email=authentication.getName();

        User user=userRepository.findByEmail(email).orElse(null);

        if(user==null) {
            return ResponseEntity.status(401).build();
        }

        item.setUsername(user.getUsername());
        item.setEmail(user.getEmail());

        FoundItem savedItem=foundItemRepository.save(item);

        return ResponseEntity.ok(savedItem);
    }

    @GetMapping
    public ResponseEntity<List<FoundItem>> getFoundItems() {

        List<FoundItem> items=foundItemRepository.findAll();

        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFoundItem(
            @PathVariable String id,
            Authentication authentication) {

        FoundItem item=foundItemRepository.findById(id).orElse(null);

        if(item==null) {
            return ResponseEntity.notFound().build();
        }

        String loggedInEmail=authentication.getName();

        if(!item.getEmail().equals(loggedInEmail)) {
            return ResponseEntity.status(403)
                    .body("You can only delete your own found items");
        }

        foundItemRepository.deleteById(id);

        return ResponseEntity.ok("Found item deleted successfully");
    }
}
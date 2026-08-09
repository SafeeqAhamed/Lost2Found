package com.example.lostfound.repository;

import com.example.lostfound.model.FoundItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FoundItemRepository extends MongoRepository<FoundItem,String> {
}
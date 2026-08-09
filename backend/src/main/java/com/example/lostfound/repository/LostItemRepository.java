package com.example.lostfound.repository;

import com.example.lostfound.model.LostItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LostItemRepository extends MongoRepository<LostItem,String> {
}
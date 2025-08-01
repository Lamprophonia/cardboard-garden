package com.cardboardgarden.controller;

import com.cardboardgarden.entity.Card;
import com.cardboardgarden.repository.CardRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CardController {
    
    private static final Logger logger = LoggerFactory.getLogger(CardController.class);
    
    @Autowired
    private CardRepository cardRepository;
    
    /**
     * Search cards by name
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchCards(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Card> cards = cardRepository.findByNameContainingIgnoreCase(name, pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "cards", cards.getContent(),
                "totalElements", cards.getTotalElements(),
                "totalPages", cards.getTotalPages(),
                "currentPage", cards.getNumber(),
                "pageSize", cards.getSize()
            ));
            
        } catch (Exception e) {
            logger.error("Card search error for name: {}", name, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Card search failed"
                    ));
        }
    }
    
    /**
     * Search cards by alternative names using Oracle ID
     */
    @GetMapping("/search/alternative")
    public ResponseEntity<Map<String, Object>> searchAlternativeCards(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Card> cards = cardRepository.findAlternativeCardsByName(name, pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "cards", cards.getContent(),
                "totalElements", cards.getTotalElements(),
                "totalPages", cards.getTotalPages(),
                "currentPage", cards.getNumber(),
                "pageSize", cards.getSize()
            ));
            
        } catch (Exception e) {
            logger.error("Alternative card search error for name: {}", name, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Alternative card search failed"
                    ));
        }
    }
    
    /**
     * Get card by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCard(@PathVariable String id) {
        try {
            Optional<Card> cardOpt = cardRepository.findById(id);
            
            if (cardOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "card", cardOpt.get()
            ));
            
        } catch (Exception e) {
            logger.error("Get card error for ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Failed to retrieve card"
                    ));
        }
    }
    
    /**
     * Get cards by set
     */
    @GetMapping("/set/{setCode}")
    public ResponseEntity<Map<String, Object>> getCardsBySet(
            @PathVariable String setCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Card> cards = cardRepository.findBySetCodeIgnoreCase(setCode, pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "cards", cards.getContent(),
                "totalElements", cards.getTotalElements(),
                "totalPages", cards.getTotalPages(),
                "currentPage", cards.getNumber(),
                "pageSize", cards.getSize(),
                "setCode", setCode
            ));
            
        } catch (Exception e) {
            logger.error("Get cards by set error for set: {}", setCode, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Failed to retrieve cards by set"
                    ));
        }
    }
    
    /**
     * Get cards by rarity
     */
    @GetMapping("/rarity/{rarity}")
    public ResponseEntity<Map<String, Object>> getCardsByRarity(
            @PathVariable String rarity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Card> cards = cardRepository.findByRarityIgnoreCase(rarity, pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "cards", cards.getContent(),
                "totalElements", cards.getTotalElements(),
                "totalPages", cards.getTotalPages(),
                "currentPage", cards.getNumber(),
                "pageSize", cards.getSize(),
                "rarity", rarity
            ));
            
        } catch (Exception e) {
            logger.error("Get cards by rarity error for rarity: {}", rarity, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Failed to retrieve cards by rarity"
                    ));
        }
    }
    
    /**
     * Get all cards with filters
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCards(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String setCode,
            @RequestParam(required = false) String rarity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Card> cards;
            
            if (name != null && !name.trim().isEmpty()) {
                cards = cardRepository.findByNameContainingIgnoreCase(name.trim(), pageable);
            } else if (setCode != null && !setCode.trim().isEmpty()) {
                cards = cardRepository.findBySetCodeIgnoreCase(setCode.trim(), pageable);
            } else if (rarity != null && !rarity.trim().isEmpty()) {
                cards = cardRepository.findByRarityIgnoreCase(rarity.trim(), pageable);
            } else {
                cards = cardRepository.findAll(pageable);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "cards", cards.getContent(),
                "totalElements", cards.getTotalElements(),
                "totalPages", cards.getTotalPages(),
                "currentPage", cards.getNumber(),
                "pageSize", cards.getSize()
            ));
            
        } catch (Exception e) {
            logger.error("Get all cards error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "success", false,
                        "message", "Failed to retrieve cards"
                    ));
        }
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        try {
            long cardCount = cardRepository.count();
            return ResponseEntity.ok(Map.of(
                "status", "OK",
                "message", "Cards service is running",
                "cardCount", cardCount,
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            logger.error("Cards health check error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "status", "ERROR",
                        "message", "Cards service error",
                        "timestamp", System.currentTimeMillis()
                    ));
        }
    }
}

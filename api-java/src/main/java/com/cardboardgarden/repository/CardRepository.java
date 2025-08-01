package com.cardboardgarden.repository;

import com.cardboardgarden.entity.Card;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, String> {
    
    /**
     * Search cards by name (case-insensitive, partial match) with pagination
     */
    @Query("SELECT c FROM Card c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY c.name")
    Page<Card> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);
    
    /**
     * Find cards by set code with pagination
     */
    @Query("SELECT c FROM Card c WHERE LOWER(c.setCode) = LOWER(:setCode) ORDER BY c.collectorNumber")
    Page<Card> findBySetCodeIgnoreCase(@Param("setCode") String setCode, Pageable pageable);
    
    /**
     * Find cards by rarity with pagination
     */
    @Query("SELECT c FROM Card c WHERE LOWER(c.rarity) = LOWER(:rarity) ORDER BY c.name")
    Page<Card> findByRarityIgnoreCase(@Param("rarity") String rarity, Pageable pageable);
    
    /**
     * Find alternative cards by name using Oracle ID with pagination
     */
    @Query("SELECT c FROM Card c WHERE c.oracleId IN " +
           "(SELECT DISTINCT c2.oracleId FROM Card c2 WHERE LOWER(c2.name) LIKE LOWER(CONCAT('%', :name, '%')) AND c2.oracleId IS NOT NULL) " +
           "ORDER BY c.name")
    Page<Card> findAlternativeCardsByName(@Param("name") String name, Pageable pageable);
    
    /**
     * Find cards with the same Oracle ID (for alternative names) - non-paginated
     */
    @Query("SELECT c FROM Card c WHERE c.oracleId = :oracleId ORDER BY c.name")
    List<Card> findByOracleId(@Param("oracleId") String oracleId);
    
    /**
     * Find Oracle IDs for cards matching a name search
     */
    @Query("SELECT DISTINCT c.oracleId FROM Card c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) AND c.oracleId IS NOT NULL")
    List<String> findOracleIdsByNameContaining(@Param("name") String name);
    
    /**
     * Find cards by Oracle IDs (for alternative name search)
     */
    @Query("SELECT c FROM Card c WHERE c.oracleId IN :oracleIds ORDER BY c.name")
    List<Card> findByOracleIdIn(@Param("oracleIds") List<String> oracleIds);
    
    /**
     * Find cards by set code - non-paginated
     */
    @Query("SELECT c FROM Card c WHERE LOWER(c.setCode) = LOWER(:setCode) ORDER BY c.collectorNumber")
    List<Card> findBySetCodeOrderByCollectorNumber(@Param("setCode") String setCode);
    
    /**
     * Find cards by rarity - non-paginated
     */
    @Query("SELECT c FROM Card c WHERE LOWER(c.rarity) = LOWER(:rarity) ORDER BY c.name")
    List<Card> findByRarityOrderByName(@Param("rarity") String rarity);
    
    /**
     * Find cards with double faces (for maintenance)
     */
    @Query("SELECT c FROM Card c WHERE c.cardFaces IS NOT NULL AND c.cardFaces != '' AND c.cardFaces != 'null'")
    List<Card> findCardsWithFaces();
    
    /**
     * Search cards with advanced filters
     */
    @Query("SELECT c FROM Card c WHERE " +
           "(:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:setCode IS NULL OR LOWER(c.setCode) = LOWER(:setCode)) AND " +
           "(:rarity IS NULL OR LOWER(c.rarity) = LOWER(:rarity)) AND " +
           "(:typeLine IS NULL OR LOWER(c.typeLine) LIKE LOWER(CONCAT('%', :typeLine, '%'))) " +
           "ORDER BY c.name")
    List<Card> searchCards(
        @Param("name") String name,
        @Param("setCode") String setCode, 
        @Param("rarity") String rarity,
        @Param("typeLine") String typeLine
    );
}

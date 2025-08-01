package com.cardboardgarden.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
public class Card {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "mana_cost")
    @JsonProperty("mana_cost")
    private String manaCost;
    
    @Column(name = "type_line")
    @JsonProperty("type_line")
    private String typeLine;
    
    @Column(name = "oracle_text", columnDefinition = "TEXT")
    @JsonProperty("oracle_text")
    private String oracleText;
    
    @Column(name = "flavor_text", columnDefinition = "TEXT")
    @JsonProperty("flavor_text")
    private String flavorText;
    
    private String power;
    private String toughness;
    private String loyalty;
    
    @Column(name = "oracle_id")
    @JsonProperty("oracle_id")
    private String oracleId;
    
    @Column(name = "set_code")
    @JsonProperty("set_code")
    private String setCode;
    
    @Column(name = "set_name")
    @JsonProperty("set_name")
    private String setName;
    
    @Column(name = "collector_number")
    @JsonProperty("collector_number")
    private String collectorNumber;
    
    private String rarity;
    private String artist;
    
    @Column(name = "image_uri_small")
    @JsonProperty("image_uri_small")
    private String imageUriSmall;
    
    @Column(name = "image_uri_normal")
    @JsonProperty("image_uri_normal")
    private String imageUriNormal;
    
    @Column(name = "image_uri_large")
    @JsonProperty("image_uri_large")
    private String imageUriLarge;
    
    @Column(name = "scryfall_uri")
    @JsonProperty("scryfall_uri")
    private String scryfallUri;
    
    @Column(name = "released_at")
    @JsonProperty("released_at")
    private LocalDateTime releasedAt;
    
    @Column(name = "created_at")
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
    
    // New fields for double-faced cards
    private String layout;
    
    @Column(name = "card_faces", columnDefinition = "JSON")
    @JsonProperty("card_faces")
    private String cardFaces;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getManaCost() {
        return manaCost;
    }
    
    public void setManaCost(String manaCost) {
        this.manaCost = manaCost;
    }
    
    public String getTypeLine() {
        return typeLine;
    }
    
    public void setTypeLine(String typeLine) {
        this.typeLine = typeLine;
    }
    
    public String getOracleText() {
        return oracleText;
    }
    
    public void setOracleText(String oracleText) {
        this.oracleText = oracleText;
    }
    
    public String getFlavorText() {
        return flavorText;
    }
    
    public void setFlavorText(String flavorText) {
        this.flavorText = flavorText;
    }
    
    public String getPower() {
        return power;
    }
    
    public void setPower(String power) {
        this.power = power;
    }
    
    public String getToughness() {
        return toughness;
    }
    
    public void setToughness(String toughness) {
        this.toughness = toughness;
    }
    
    public String getLoyalty() {
        return loyalty;
    }
    
    public void setLoyalty(String loyalty) {
        this.loyalty = loyalty;
    }
    
    public String getOracleId() {
        return oracleId;
    }
    
    public void setOracleId(String oracleId) {
        this.oracleId = oracleId;
    }
    
    public String getSetCode() {
        return setCode;
    }
    
    public void setSetCode(String setCode) {
        this.setCode = setCode;
    }
    
    public String getSetName() {
        return setName;
    }
    
    public void setSetName(String setName) {
        this.setName = setName;
    }
    
    public String getCollectorNumber() {
        return collectorNumber;
    }
    
    public void setCollectorNumber(String collectorNumber) {
        this.collectorNumber = collectorNumber;
    }
    
    public String getRarity() {
        return rarity;
    }
    
    public void setRarity(String rarity) {
        this.rarity = rarity;
    }
    
    public String getArtist() {
        return artist;
    }
    
    public void setArtist(String artist) {
        this.artist = artist;
    }
    
    public String getImageUriSmall() {
        return imageUriSmall;
    }
    
    public void setImageUriSmall(String imageUriSmall) {
        this.imageUriSmall = imageUriSmall;
    }
    
    public String getImageUriNormal() {
        return imageUriNormal;
    }
    
    public void setImageUriNormal(String imageUriNormal) {
        this.imageUriNormal = imageUriNormal;
    }
    
    public String getImageUriLarge() {
        return imageUriLarge;
    }
    
    public void setImageUriLarge(String imageUriLarge) {
        this.imageUriLarge = imageUriLarge;
    }
    
    public String getScryfallUri() {
        return scryfallUri;
    }
    
    public void setScryfallUri(String scryfallUri) {
        this.scryfallUri = scryfallUri;
    }
    
    public LocalDateTime getReleasedAt() {
        return releasedAt;
    }
    
    public void setReleasedAt(LocalDateTime releasedAt) {
        this.releasedAt = releasedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getLayout() {
        return layout;
    }
    
    public void setLayout(String layout) {
        this.layout = layout;
    }
    
    public String getCardFaces() {
        return cardFaces;
    }
    
    public void setCardFaces(String cardFaces) {
        this.cardFaces = cardFaces;
    }
}

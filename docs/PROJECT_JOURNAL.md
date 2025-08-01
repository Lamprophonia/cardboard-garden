# Cardboard Garden Project Journal

## Entry - July 31, 2025

### Today's Accomplishments

#### Maven Configuration Resolution
- **Problem**: Spring Boot application failed to start due to corrupted Maven settings
- **Root Cause**: `~/.m2/settings.xml` contained references to unavailable Pentaho repositories
- **Solution**: Deleted the problematic settings.xml file to restore default Maven Central repository access
- **Result**: Maven dependency resolution now working correctly, all Spring Boot dependencies downloading successfully

#### Spring Boot Application Progress
- **Status**: Application successfully compiles and starts
- **Achievements**:
  - Maven clean operation successful
  - Spring Boot 3.2.2 with Java 17 runtime established
  - Embedded Tomcat server configured on port 3001
  - Database connection to MySQL established via HikariPool
  - Spring Security configuration active
  - DevTools enabled for development

#### Database Schema Issues Identified
- **Current Blocker**: Hibernate schema validation error
- **Specific Issue**: `cards.id` column type mismatch
  - Database has: `varchar` (Types#VARCHAR)
  - JPA Entity expects: `bigint` (Types#BIGINT)
- **Next Steps**: Need to align database schema with JPA entity definitions

#### Technical Stack Confirmed
- **Backend**: Spring Boot 3.2.2, Java 17, Maven 3.x
- **Database**: MySQL with Hibernate 6.4.1.Final
- **Security**: JWT-based authentication with Spring Security
- **Development**: Spring DevTools, embedded Tomcat

### Key Learnings
1. Corporate Maven settings can interfere with project builds when external repositories become unavailable
2. Deleting `~/.m2/settings.xml` restores default Maven behavior for standard projects
3. Spring Boot startup sequence is robust - can identify specific failure points in database schema validation

### Next Session Priorities
1. Resolve database schema validation errors for `cards` table
2. Investigate other potential schema mismatches
3. Consider Hibernate auto-DDL configuration vs manual schema updates
4. Complete Spring Boot application startup testing

### Future Feature Roadmap

**Preconstructed Product Integration** (High Priority Future Feature):
- Auto-import feature for preconstructed products (Commander precons, starter decks, etc.)
- One-click addition of complete product to collection and deck list
- Support across all TCG games with product-specific handling
- Integration with product databases and pricing information

**Deck Building States: "Planned vs Planted Garden"** (Core Deck Builder Feature):
- **Planned Decks** (Unbuilt): Theoretical decklists, wishlists, brewing concepts
  - No inventory checking required
  - Can exceed collection limits
  - Focus on deck optimization and theory
- **Planted Decks** (Built): Physical decks using actual owned cards
  - Real-time inventory validation against collection
  - Card borrowing/allocation system between decks
  - Prevents double-allocation of single cards
  - "Missing cards" alerts for incomplete builds
  - Integration with collection management for deck assembly

---
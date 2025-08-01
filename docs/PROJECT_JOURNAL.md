# Cardboard Garden Project Journal

## Entry - August 1, 2025 🎉 **MILESTONE: Professional Service Management**

### Major Achievement: PM2 Process Management Implementation

#### Complete Infrastructure Overhaul
- **Migration**: Successfully transitioned from PowerShell background jobs to PM2 professional process management
- **Port Issue Resolution**: Fixed critical string concatenation bug causing port 30001 instead of 3000
- **Windows Compatibility**: Created ES module wrapper for Vite frontend in PM2 environment
- **Service Status**: Both API and frontend running stable with professional monitoring

#### Technical Implementation Details
- **API Server**: Node.js/Express on port 3000 with smart port detection
- **Frontend**: React + Vite on port 5173 with PM2-compatible ES module launcher
- **Process Management**: PM2 with auto-restart, memory limits, structured logging
- **Port Detection**: Dynamic API discovery system with .api-port file coordination
- **Database**: Complete with 108,809+ Magic cards imported from Scryfall

#### Service Management Infrastructure
- **PM2 Configuration**: `ecosystem.config.js` with professional-grade settings
- **PowerShell Integration**: `pm2-manager.ps1` wrapper maintaining user workflow preferences
- **Logging**: Structured logs with timestamps in dedicated log files
- **Memory Management**: Automatic restart at 1GB limit, current usage ~55MB each service
- **Auto-restart**: Services automatically recover from crashes

#### Bug Fixes & Optimizations
- **Critical Fix**: `parseInt(process.env.PORT, 10)` preventing string concatenation in port detection
- **ES Module Support**: Created Node.js wrapper for Vite in PM2 Windows environment
- **Path Resolution**: Corrected PM2 manager script path handling for ecosystem config
- **Health Checks**: Implemented robust API health monitoring and frontend discovery

### Current System Status ✅
- **API**: http://localhost:3000 (healthy, 54.9MB memory)
- **Frontend**: http://localhost:5173 (responding, 42.0MB memory)
- **Database**: 108,809 Magic cards, Oracle ID relationships, search functionality
- **Services**: Professional monitoring with PM2, zero-downtime operation
- **Alternative Cards**: Bidirectional search working (e.g., "thrum" finds "Thrum of the Vestige")

### Professional Development Standards Achieved
- **Industry-Standard Process Management**: PM2 ecosystem with professional configuration
- **Service Discovery**: Dynamic API URL detection preventing hardcoded dependencies
- **Robust Error Handling**: Auto-restart, memory monitoring, structured logging
- **Development Workflow**: Maintained PowerShell preferences while adding professional capabilities
- **Windows Integration**: Full compatibility with Windows development environment

### Next Session Priorities
1. **Feature Development**: Begin Magic card collection management features
2. **User Interface**: Enhance search functionality and collection displays
3. **Data Validation**: Implement comprehensive testing framework
4. **Performance**: Optimize database queries and frontend rendering

---

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
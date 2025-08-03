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

## 🎉 **MILESTONE: Complete Theme System Implementation** (August 1, 2025)
- ✅ Professional light/dark theme switching with CSS variables and smooth transitions
- ✅ Fixed all hardcoded white backgrounds across components (main content, sidebar, footer)  
- ✅ ThemeProvider context with localStorage persistence and system preference detection
- ✅ Streamlined to two themes (Light/Dark) removing unnecessary high contrast option
- ✅ Optimal button sizing preventing text wrapping and layout issues
- **Future Architecture**: Theme toggle migration from header to user settings (authenticated users only)

## 🏠 **Core Collection System: "Bookshelf Metaphor"** (Primary Development Focus)

### **Collection Hierarchy Architecture**
**🏠 Bookshelves** (TCG-Specific Organization):
- Separate collections for each trading card game (Magic, Pokemon, Yu-Gi-Oh, etc.)
- Visual bookshelf representation with customizable aesthetics
- Multi-game support building on existing Magic foundation (108,809+ cards)

**📖 Binders** (Rich Detail & Customization):
- Detailed card information with visual binder interface
- Flexible organization: by set (default), custom splits, or user preference
- Example: Single Aetherdrift binder vs separate Commander/Variants binders
- **Check-out System**: Cards can be removed and replaced with proxy markers
- Proxy cards reference which deck currently contains the physical card
- Prevents accidental double-allocation of single cards

**📦 Bulk Boxes** (Minimal Data, Maximum Search):
- Simplified storage for large quantities of common cards
- Focus on essential data: name, quantity, basic search metadata
- Robust search functionality for quick bulk card lookups
- Mirrors real-life bulk collection management

**🎒 Bags** (Format-Specific Organization):
- Represents different play formats (Standard, Commander, Vintage, etc.)
- Optional deck containers - decks can exist independently on "shelf"
- Visual metaphor of format-specific gear bags

**🗃️ Deckboxes** (Advanced Deck Management):
- Feature-rich deck building and management system
- Integration with "Planned vs Planted Garden" concepts:
  - **Planned Decks**: Theoretical builds, no inventory validation
  - **Planted Decks**: Physical decks with real-time collection integration
- Deck rule validation (similar to Archidekt)
- Multiple import formats for popular deck building sites
- Custom checklists: missing cards, proxy status, completion tracking
- Card checkout system with binder proxy generation

### **Visual & Animation Polish** (Professional Differentiation)
**Custom Animations**:
- Card-to-binder animations when adding cards to collection
- Multi-card batch animations with visual feedback
- Authentic TCG-specific card backs in animations
- Smooth transitions matching completed theme system

**Aesthetic Customization**:
- Binder spine colors and styles (multiple options)
- Deckbox visual customization (common collector styles)
- Inside-binder view with realistic page layouts
- **Premium Feature**: Custom binder art creation with printable exports
- Physical collection integration via printable binder designs

## 🚀 **Implementation Phases**

### **Phase 1: Core Infrastructure** (Next Priority)
- User authentication and collection ownership
- Bookshelf/Binder data models and API endpoints
- Basic collection management (add/remove cards)
- Simple search within collections

### **Phase 2: Advanced Collection Features**
- Bulk box implementation with advanced search
- Card checkout system with proxy generation
- Binder customization and visual improvements
- Multi-TCG expansion beyond Magic

### **Phase 3: Deck Management Integration** 
- Deckbox creation and management
- Planned vs Planted deck systems
- Rule validation and import functionality  
- Custom checklist generation

### **Phase 4: Visual Polish & Premium Features**
- Custom animations and card-back authenticity
- Advanced aesthetic customization
- Printable binder art generation
- Professional collector workflow optimization

## 🎯 **Legacy Features (Still Relevant)**

**Preconstructed Product Integration** (High Priority Future Feature):
- Auto-import feature for preconstructed products (Commander precons, starter decks, etc.)
- One-click addition of complete product to collection and deck list
- Support across all TCG games with product-specific handling
- Integration with product databases and pricing information


## Entry - August 2, 2025

### Debugging & Maintenance Session

**Focus:**
- Persistent debugging of user registration and email verification flow
- Added debug logging to backend registration logic to trace verification token issues
- Confirmed frontend token extraction and backend token handling
- Identified and began resolving issue where `email_verification_token` was NULL in new user records
- Maintenance prompt file (`.maintenance-prompts.md`) created for ongoing project health

**Key Progress:**
- Fixed dynamic import bug in frontend email verification page
- Added backend debug logs for registration and token generation
- Provided SQL cleanup for incomplete user records
- Confirmed frontend and backend token tracing is now robust
- Maintenance prompt file authored with Clause Sonnet for future sweeps

**Current Blockers:**
- Registration flow: `email_verification_token` sometimes NULL in DB (debug logging now in place)
- Need to verify backend logs and DB after next registration attempt

**Next Steps:**
1. Review backend logs for token generation and DB insert
2. Continue manual and automated testing of registration/verification
3. Run full maintenance sweep using new prompt file
4. Document any further issues or fixes in next session

---
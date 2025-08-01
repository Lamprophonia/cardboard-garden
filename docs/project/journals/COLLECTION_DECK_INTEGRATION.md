# Collection-Deck Integration Design Journal
**Date:** July 31, 2025
**Phase:** Planning & Design
**Status:** Concept Development

## 🎯 Core Integration Requirements

### **Bidirectional Collection-Deck Awareness**

#### **Collection View Enhancements:**
- **Deck Usage Indicators**: Cards show which decks they're allocated to
- **Available Quantity Display**: Show "3 owned, 2 in decks, 1 available"
- **Multi-Deck Allocation**: Track when same card is used across multiple decks
- **Reserved Card Warning**: Alert when trying to use cards already allocated

#### **Deck Building Intelligence:**
- **Ownership Status**: Cards marked as "Have", "Need", or "Getting"
- **Availability Check**: Real-time validation against available collection
- **Smart Suggestions**: Recommend similar cards you own when desired card unavailable
- **Quantity Conflicts**: Prevent overallocation of limited cards

## 🔧 Technical Implementation Concepts

### **Database Schema Additions:**
```sql
-- Track card allocation across decks
ALTER TABLE deck_cards ADD COLUMN reserved_from_collection BOOLEAN DEFAULT TRUE;

-- Collection availability tracking
ALTER TABLE collection ADD COLUMN available_quantity INT GENERATED AS (quantity - allocated_quantity);
ALTER TABLE collection ADD COLUMN allocated_quantity INT DEFAULT 0;

-- Deck completion tracking
ALTER TABLE decks ADD COLUMN completion_status ENUM('complete', 'partial', 'wishlist') DEFAULT 'wishlist';
ALTER TABLE decks ADD COLUMN missing_cards_count INT DEFAULT 0;

-- Advanced search support
CREATE TABLE saved_searches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(255) NOT NULL,
  search_criteria JSON NOT NULL,
  is_template BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search result caching for performance
CREATE TABLE search_cache (
  cache_key VARCHAR(255) PRIMARY KEY,
  result_data JSON NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Card visual variants tracking
ALTER TABLE cards ADD COLUMN frame_effects JSON; -- borderless, extended_art, showcase, etc.
ALTER TABLE cards ADD COLUMN promo_types JSON; -- prerelease, fnm, gameday, etc.
ALTER TABLE cards ADD COLUMN finishes JSON; -- foil, nonfoil, etched, etc.
```

### **Search Query Structure:**
```javascript
// Example complex search query
{
  "filters": {
    "sets": ["fdn"], // Foundations
    "frameEffects": ["borderless", "extended_art"],
    "owned": false, // Not in collection
    "colors": {"operator": "OR", "values": ["R", "G"]},
    "cmc": {"min": 3, "max": 6},
    "types": {"include": ["Creature"], "exclude": ["Token"]}
  },
  "sort": [
    {"field": "name", "direction": "asc"},
    {"field": "cmc", "direction": "asc"}
  ],
  "export": {
    "format": "txt",
    "columns": ["name", "set", "collector_number", "rarity"],
    "groupBy": "rarity",
    "includeHeaders": true,
    "priceData": false
  }
}
```

### **API Endpoints for Integration:**
- `GET /api/collection/{cardId}/availability` - Check available quantities
- `POST /api/decks/{deckId}/validate` - Validate deck against collection
- `PUT /api/collection/allocate` - Reserve cards for deck building
- `GET /api/decks/{deckId}/missing` - Get missing cards list
- `GET /api/collection/allocated` - See all reserved cards

### **Advanced Search API Endpoints:**
- `POST /api/search/advanced` - Complex multi-criteria card search
- `GET /api/search/export/{format}` - Export search results in various formats
- `POST /api/search/save` - Save frequently used search queries
- `GET /api/search/templates` - Get predefined search templates
- `POST /api/collection/audit` - Generate collection audit checklists

## 🔍 Advanced Search & Export System

### **Comprehensive Search Capabilities:**
- **Multi-Criteria Filtering**: Combine set, rarity, type, colors, mana cost, artist, etc.
- **Collection Status**: Filter by owned/unowned, quantities, conditions
- **Visual Variants**: Borderless, extended art, foil, showcase, alternate art
- **Deck Integration**: Search cards by deck usage, availability status
- **Advanced Operators**: AND/OR logic, ranges, wildcards, regex support

### **Search Examples:**
- "All Foundations borderless cards I don't own"
- "Creatures with CMC 3-5 from my collection available for deck building"  
- "All mythic rares from 2024 sets missing from collection"
- "Cards I own 4+ copies of not currently in any deck"
- "All red cards under $10 that would complete my burn deck"

### **Export & List Generation:**
#### **Format Options:**
- **Plain Text**: Simple card names with quantities
- **Formatted Lists**: Organized by set/rarity with metadata
- **CSV Export**: Spreadsheet-compatible with all card data
- **JSON Export**: Complete card objects for external tools
- **Print-Friendly PDFs**: Formatted checklists for store visits
- **Deck Format**: MTG Arena, MTG Online, or tournament-legal formats

#### **Customizable Output:**
- **Column Selection**: Choose which card attributes to include
- **Sorting Options**: By name, set, rarity, price, owned status
- **Grouping**: Organize by set, color, type, or custom categories
- **Checkboxes**: Add checkboxes for physical collection tracking
- **Price Integration**: Include current market prices in exports
- **Store Sections**: Group by typical store organization

### **Physical Collection Tools:**
#### **Shopping Lists:**
- **Store-Optimized Layout**: Organize by typical store sections
- **Budget Tracking**: Running totals with price estimates
- **Priority Ranking**: Mark cards by importance/urgency
- **Condition Preferences**: Specify acceptable card conditions
- **Store-Specific**: Separate lists per store based on known inventory

#### **Collection Auditing:**
- **Inventory Checklists**: Physical verification of owned cards
- **Discrepancy Reports**: Compare physical vs digital collection
- **Bulk Entry Forms**: Quick ways to add multiple found cards
- **QR Codes**: Generate scannable codes for quick digital updates

## 🛒 Local Card Store Integration (Future Vision)

### **Location-Based Shopping:**
- **Store Locator**: Integration with WPN store locator
- **Local Inventory Check**: API calls to participating stores
- **Price Comparison**: Local vs online pricing
- **Availability Alerts**: Notify when local stores get needed cards

### **Shopping List Generation:**
- **Missing Cards Export**: Generate formatted shopping lists
- **Store-Specific Lists**: Separate lists per store based on inventory
- **Budget Tracking**: Set spending limits and track purchases
- **Priority Ranking**: Mark cards by deck importance

### **Community Features:**
- **Local Player Network**: Connect with nearby players
- **Trade Suggestions**: Match local players' want/have lists
- **Event Integration**: Link to local tournament schedules
- **Store Reviews**: Community-driven store ratings

## 🎮 User Experience Flows

### **Advanced Search Experience:**
1. **Query Builder Interface**: Visual filter construction with real-time preview
2. **Search Result Preview**: Live card count and sample results as filters change
3. **Export Options**: One-click access to multiple format downloads
4. **Save & Share**: Bookmark complex searches and share with community
5. **Template Library**: Pre-built searches for common collection tasks

### **Deck Building with Collection:**
1. Select cards for deck
2. System checks collection availability
3. Shows owned/needed status for each card
4. Generates shopping list for missing cards
5. Reserves owned cards for this deck
6. Updates collection availability in real-time

### **Collection Management with Decks:**
1. View card in collection
2. See which decks use this card
3. Modify quantity with deck impact warnings
4. Reallocate cards between decks
5. Track acquisition progress for deck completion

## 🔄 State Management Considerations

### **Real-time Synchronization:**
- **WebSocket Updates**: Live updates when cards allocated/deallocated
- **Conflict Resolution**: Handle simultaneous deck building sessions
- **Offline Mode**: Cache allocation state for offline use
- **Undo/Redo**: Track allocation changes with rollback capability

### **Data Consistency:**
- **Transaction Locks**: Prevent overselling collection
- **Allocation Queues**: Handle multiple deck edits simultaneously
- **Audit Trails**: Track who allocated what when
- **Backup States**: Periodic snapshots of allocation state

## 🏪 Local Store Integration Architecture

### **Third-Party Integrations:**
- **Wizards Store Locator API**: Find nearby WPN stores
- **Google Places API**: Store information and reviews
- **Store Inventory APIs**: Where available from major retailers
- **Price Aggregation**: Scrape or API from price comparison sites

### **Community Data:**
- **User-Submitted Inventory**: Players report store stock
- **Crowdsourced Pricing**: Community price reporting
- **Store Event Calendars**: User-maintained event schedules
- **Local Meta Tracking**: Popular decks by region

## 🚀 Implementation Phases

### **Phase 1: Core Integration**
- Collection-deck quantity tracking
- Basic availability checking
- Simple allocation system
- **Advanced search foundation with basic export**

### **Phase 2: Smart Features**
- Deck completion analysis
- Missing cards shopping lists
- Allocation conflict resolution
- **Comprehensive search with all export formats**
- **Search templates and saved queries**

### **Phase 3: Local Integration**
- Store locator integration
- Local inventory checking
- Community trading features
- **Store-optimized shopping lists**
- **Community search sharing**

### **Phase 4: Advanced Commerce**
- Local store partnerships
- Automated ordering systems
- Price tracking and alerts
- **Automated list generation based on local store inventory**
- **AI-powered collection optimization suggestions**

## 💡 Innovation Opportunities

### **AI-Powered Suggestions:**
- **Meta Analysis**: Suggest local store visits based on local tournament meta
- **Budget Optimization**: Recommend most cost-effective card acquisition strategies
- **Collection Analytics**: Identify underutilized cards in collection
- **Trade Recommendations**: Match players with complementary needs

### **Budget-Conscious Deck Building:**
- **Expensive Card Detection**: Automatically flag cards above user-defined price thresholds
- **Alternative Suggestions**: Recommend functionally similar but cheaper cards
- **Budget Tracking**: Real-time deck cost calculation with price alerts
- **Gradual Upgrade Paths**: Suggest sequences for building budget decks toward optimal versions
- **Format-Specific Alternatives**: Consider format legality when suggesting replacements
- **Synergy Preservation**: Ensure suggested alternatives maintain deck strategy and synergies

#### **Alternative Suggestion Engine:**
- **Functional Analysis**: Match cards by effects, not just stats (e.g., "destroy target creature")
- **Mana Curve Awareness**: Suggest alternatives that maintain optimal mana distribution
- **Color Identity**: Respect deck color requirements and mana base constraints
- **Power Level Scaling**: Offer alternatives at different competitive levels
- **Meta Considerations**: Factor in current format popularity and effectiveness
- **Collection Integration**: Prioritize alternatives already in user's collection

#### **Budget Planning Tools:**
- **Price Tier Visualization**: Show deck cost breakdown by card price ranges
- **Upgrade Priority Rankings**: Identify which expensive cards provide biggest impact
- **Budget Allocation**: Suggest optimal spending distribution across deck slots
- **Market Timing**: Track price trends and suggest optimal purchase timing
- **Format Rotation Impact**: Warn about cards rotating out of Standard/Pioneer
- **Reprint Probability**: Consider likelihood of reprints affecting card values

### **Mobile Integration:**
- **Store Visit Check-ins**: Verify visits to local stores
- **Barcode Scanning**: Quick collection updates while shopping
- **Location-Based Alerts**: Notify when near stores with needed cards
- **Social Shopping**: Coordinate group store visits

## 🎯 Success Metrics

### **User Engagement:**
- Deck completion rates
- Local store visit frequency
- Collection accuracy improvements
- Community feature adoption

### **Business Value:**
- Local store partnership growth
- User retention through community features
- Reduced online shopping through local alternatives
- Enhanced user lifetime value

---

**Next Steps:**
1. Implement basic collection-deck allocation system
2. Design UI mockups for integrated views
3. Research local store API availability
4. Plan community feature rollout strategy

# Collection Management & Visual Proxy System

## Core Concept
Realistic Magic collection system that mirrors physical storage and visual states of cards.

## Physical Storage Modeling
- **Binders**: 9-pocket pages, specific page/slot tracking
- **Bulk Storage**: 5000-count boxes, estimated quantities
- **Deck Boxes**: Active constructed decks
- **Premium Storage**: Toploaders for expensive cards

## Visual Proxy System
When cards are allocated to decks, they appear as hand-drawn "proxy" cards in binders.

### Proxy Visual Design
- **Base**: Desaturated/grayscale original image
- **Overlay**: Hand-drawn style text using "Permanent Marker" font
- **Text**: Rotated (-10° to +10°), marker colors (red/blue/black)
- **Background**: Semi-transparent white "tape" effect
- **Examples**: "IN BURN DECK", "COMMANDER - Ur-Dragon", "LENT TO MIKE"

### Technical Implementation
- **Dynamic Generation**: CSS overlays + Canvas for complex effects
- **No File Storage**: Generate proxy appearance on-demand
- **Performance**: Cache temporarily, regenerate when needed

## Collection States
- **Available**: Full color, normal image
- **In Deck**: Proxy appearance with deck name
- **Lent Out**: Proxy with person's name
- **Missing**: Placeholder indicating need to acquire

## Multi-Format Support
Support all Magic formats with realistic deck building constraints and legality checking.

## Database Concepts
```sql
-- Track physical location and allocation
collection_items (card_id, container_id, quantity_owned, quantity_available, visual_state, proxy_reason)

-- Storage containers
storage_containers (type, name, capacity, location)

-- Format definitions  
formats (name, deck_size, max_copies, sideboard_size)
```

## User Experience
Authentic "where did I put that card?" experience with visual feedback showing real collection state.

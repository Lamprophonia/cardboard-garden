# Deck Building Integration Concepts

## Collection-to-Deck Workflow
Seamless integration between physical collection tracking and deck building across all Magic formats.

## Smart Deck Building Features
- **Available Cards Filter**: Only show owned cards when building
- **Quantity Awareness**: Prevent over-allocation (can't add 4x if you only own 2)
- **Multi-Deck Tracking**: Know which decks are using which cards
- **Wishlist Mode**: Build theoretical decks, generate shopping lists

## Deck Allocation System
- **Physical vs Theoretical**: Track actual deck assembly vs planning
- **Shared Cards**: Multiple decks can reference same card (proxy system handles visuals)
- **Priority System**: Tournament decks vs casual decks
- **Return Tracking**: Easy "put card back in binder" workflow

## Format Support
- **Commander**: 100 singleton + commander rules
- **Constructed**: 60-card + 15 sideboard (Standard/Modern/Pioneer/Legacy)
- **Limited**: Draft/sealed from specific card pools
- **Casual**: No restrictions, kitchen table rules

## Realistic Assembly Experience
When building a deck:
1. Choose format → Apply legality filters
2. Browse collection → See available cards with location info
3. Add cards → Real-time quantity checking
4. Generate "shopping list" from own collection:
   - "Get Lightning Bolt from Trade Binder, Page 4, Slot 7"  
   - "Need 2 more Thoughtseize - check bulk box or buy"

## Smart Suggestions
- **Similar Cards**: "You own Lightning Strike, consider instead of Lightning Bolt"
- **Budget Alternatives**: Cheaper cards with similar effects
- **Collection Synergies**: "You own lots of artifacts, try artifact deck"
- **Missing Card Options**: Show price to complete deck

## Database Integration
```sql
-- Track deck allocations
deck_allocations (deck_id, card_id, quantity_allocated, available_quantity)

-- Deck definitions
decks (name, format_id, status, last_updated)

-- Card-deck relationships
deck_cards (deck_id, card_id, quantity, card_type) -- main/sideboard/maybeboard
```

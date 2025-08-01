import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/apiDiscovery';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(null);
  const [hasAlternatives, setHasAlternatives] = useState(false);
  const [flippedCards, setFlippedCards] = useState({}); // Track which cards are flipped

  // Function to get card layout badge text
  const getLayoutBadgeText = (layout) => {
    if (layout === 'transform') return 'Transform';
    if (layout === 'adventure') return 'Adventure';
    return 'Double-Faced';
  };

  // Function to flip a card
  const flipCard = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: prev[cardId] ? (prev[cardId] + 1) : 1
    }));
  };

  // Check API health on load
  useEffect(() => {
    async function discoverApi() {
      try {
        const url = await getApiUrl();
        setApiUrl(url);
        
        // Test the discovered API
        const response = await fetch(`${url}/api/health`);
        if (response.ok) {
          console.log('API is ready');
        }
      } catch (error) {
        console.error('API discovery failed:', error);
      }
    }
    
    discoverApi();
  }, []);

  // Search for cards
  const searchCards = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim() || !apiUrl) return;

    setLoading(true);
    setCards([]);
    setHasAlternatives(false);

    try {
      const response = await fetch(`${apiUrl}/api/cards/search?q=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setCards(data.cards || []);
      setHasAlternatives(data.has_alternatives || false);
      
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Magic Cards</h1>
        <p className="search-subtitle">
          Search through our database of Magic: The Gathering cards
        </p>
      </div>

      <div className="search-container">
        <form onSubmit={searchCards} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for Magic cards..."
              className="search-input"
              disabled={!apiUrl}
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={loading || !searchTerm.trim() || !apiUrl}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {hasAlternatives && (
          <div className="search-notice">
            <p>Some cards have alternative versions or faces. Click on cards to see different versions.</p>
          </div>
        )}

        <div className="search-results">
          {cards.map((card) => {
            const faceIndex = flippedCards[card.id] || 0;
            const currentFace = card.card_faces && card.card_faces.length > faceIndex 
              ? card.card_faces[faceIndex % card.card_faces.length] 
              : null;

            return (
              <div key={card.id} className="card" onClick={() => flipCard(card.id)}>
                {(() => {
                  if (currentFace?.image_uris?.normal) {
                    return (
                      <div className="card-image-container">
                        <img 
                          src={currentFace.image_uris.normal} 
                          alt={currentFace.name} 
                          className="card-image" 
                        />
                        {card.card_faces && card.card_faces.length > 1 && (
                          <div className="card-layout-badge">
                            {getLayoutBadgeText(card.layout)}
                          </div>
                        )}
                      </div>
                    );
                  } else if (card.image_uris?.normal) {
                    return (
                      <div className="card-image-container">
                        <img 
                          src={card.image_uris.normal} 
                          alt={card.name} 
                          className="card-image" 
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="card-placeholder">
                        {card.card_faces && card.card_faces.length > 1 ? (
                          <>Double-Faced<br />Card</>
                        ) : (
                          <>No Image<br />Available</>
                        )}
                      </div>
                    );
                  }
                })()}
                <div className="card-info">
                  <h3>{currentFace?.name || card.name}</h3>
                  {(currentFace?.mana_cost || card.mana_cost) && (
                    <p className="mana-cost">
                      {currentFace?.mana_cost || card.mana_cost}
                    </p>
                  )}
                  {(currentFace?.type_line || card.type_line) && (
                    <p className="type-line">
                      {currentFace?.type_line || card.type_line}
                    </p>
                  )}
                  <p className="set-info">{card.set_name} ({card.set_code.toUpperCase()})</p>
                  <span className={`rarity ${card.rarity}`}>{card.rarity}</span>
                  {card.card_faces && card.card_faces.length > 1 && (
                    <div className="double-faced-info">
                      <strong>Face {faceIndex + 1} of {card.card_faces.length}:</strong> {currentFace?.name || 'Unknown'}
                      <br />
                      <small>All faces: {card.card_faces.map(face => face.name).join(' // ')}</small>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;

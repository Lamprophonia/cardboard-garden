import React, { useState, useEffect } from 'react'
import { getApiUrl } from './utils/apiDiscovery'
import './App.css'
import Footer from './components/Footer'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking...')
  const [apiUrl, setApiUrl] = useState(null)
  const [hasAlternatives, setHasAlternatives] = useState(false)
  const [flippedCards, setFlippedCards] = useState({}) // Track which cards are flipped

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
        const data = await response.json();
        setApiStatus(`✅ ${data.message}`);
      } catch (error) {
        setApiStatus('❌ API not available');
        console.error('API discovery failed:', error);
      }
    }
    
    discoverApi();
  }, [])

  // Search for cards
  const searchCards = async () => {
    if (!searchTerm.trim() || !apiUrl) return
    
    setLoading(true)
    setFlippedCards({}) // Clear flipped state on new search
    try {
      const response = await fetch(`${apiUrl}/api/cards/search?name=${encodeURIComponent(searchTerm)}&includeAlternatives=true`)
      const data = await response.json()
      setCards(data.cards || [])
      setHasAlternatives(data.hasAlternatives || false)
    } catch (error) {
      console.error('Search failed:', error)
      setCards([])
      setHasAlternatives(false)
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🃏 Cardboard Garden</h1>
        <p className="subtitle">Magic: The Gathering Collection Manager</p>
        <div className="api-status">{apiStatus}</div>
      </header>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for Magic cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchCards()}
          />
          <button onClick={searchCards} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="results-section">
        {loading && <div className="loading">🔍 Searching through 7,747 cards...</div>}
        
        {cards.length > 0 && (
          <div className="results-header">
            <h2>Found {cards.length} cards</h2>
            {hasAlternatives && (
              <p className="alternatives-note">
                ✨ Including functionally identical cards with different names
              </p>
            )}
          </div>
        )}

        <div className="card-grid">
          {cards.map(card => {
            // Determine which face to show
            const faceIndex = card.card_faces && card.card_faces.length > 0 
              ? (flippedCards[card.id] || 0) % card.card_faces.length 
              : 0;
            const currentFace = card.card_faces?.[faceIndex];
            
            return (
              <div key={card.id} className={`magic-card ${card.is_alternative ? 'alternative-card' : ''}`}>
                {card.is_alternative && (
                  <div className="alternative-badge">Alternative Name</div>
                )}
                {/* Handle double-faced cards */}
                {card.card_faces && card.card_faces.length > 0 && (
                  <div className="double-faced-badge">
                    {getLayoutBadgeText(card.layout)}
                  </div>
                )}
                {/* Flip button for double-faced cards */}
                {card.card_faces && card.card_faces.length > 1 && (
                  <button 
                    className="flip-button" 
                    onClick={(e) => {
                      e.preventDefault();
                      flipCard(card.id);
                    }}
                    title={`Flip to ${card.card_faces[(faceIndex + 1) % card.card_faces.length]?.name || 'other side'}`}
                  >
                    🔄
                  </button>
                )}
                {/* Display image - prefer current face image for double-faced cards */}
                {(() => {
                  const imageUri = currentFace?.image_uris?.normal || card.image_uri_normal;
                  return imageUri ? (
                    <img 
                      src={imageUri} 
                      alt={currentFace?.name || card.name}
                      className="card-image"
                    />
                  ) : (
                    <div className="card-image-placeholder">
                      {card.card_faces && card.card_faces.length > 0 ? (
                        <>🎭<br />Double-Faced<br />Card</>
                      ) : (
                        <>🃏<br />No Image<br />Available</>
                      )}
                    </div>
                  );
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
      <Footer />
    </div>
  )
}

export default App

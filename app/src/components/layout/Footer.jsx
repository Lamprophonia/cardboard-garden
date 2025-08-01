import './Footer.css'

function Footer() {
  return (
    <footer className="cg-footer">
      <div className="cg-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Cardboard Garden</h3>
            <p>Cultivate your TCG collection with care</p>
          </div>
          
          <div className="footer-section">
            <h4>Games Supported</h4>
            <ul>
              <li>Magic: The Gathering</li>
              <li>Pokémon TCG</li>
              <li>Yu-Gi-Oh!</li>
              <li>Disney Lorcana</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Attributions</h4>
            <p className="attribution">
              <a href="https://www.flaticon.com/free-icons/sand" title="sand icons" target="_blank" rel="noopener noreferrer">
                Sand icons created by Freepik - Flaticon
              </a>
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Cardboard Garden. Built with care for TCG collectors.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

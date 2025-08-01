import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

function Layout({ children }) {
  const location = useLocation();
  
  // Hide layout on auth pages for cleaner login/register experience
  const isAuthPage = ['/login', '/register', '/verify-email'].includes(location.pathname);
  
  if (isAuthPage) {
    return children;
  }

  return (
    <div className="app-layout">
      <Header />
      
      <div className="layout-container">
        <Sidebar />
        
        <main className="main-content">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
        
        <RightPanel />
      </div>
      
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-brand">Cardboard Garden</span>
            <span>© 2025</span>
          </div>
          <div className="footer-right">
            <span>Magic Collection Manager</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

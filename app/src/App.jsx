import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CollectionPage from './pages/CollectionPage';
import DecksPage from './pages/DecksPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import './styles/variables.css';
import './App.css';
import './styles/auth.css';
import './styles/layout.css';
import './styles/pages.css';
// Import modular dashboard styles
import './styles/layout/grid.css';
import './styles/components/header.css';
import './styles/components/sidebar.css';
import './styles/components/right-panel.css';
import './styles/layout/responsive.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route 
              path="/collection" 
              element={
                <ProtectedRoute>
                  <CollectionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/decks" 
              element={
                <ProtectedRoute>
                  <DecksPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

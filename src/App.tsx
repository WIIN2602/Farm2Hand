import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { ChatbotPopup } from './components/ChatbotPopup';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ChatbotPage } from './pages/ChatbotPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProductsPage } from './pages/ProductsPage';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-soft-beige to-light-beige">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
        
        {/* Floating Chatbot - Available on all pages */}
        <ChatbotPopup />
      </div>
    </AuthProvider>
  );
}

export default App;
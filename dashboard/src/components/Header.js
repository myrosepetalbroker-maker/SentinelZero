import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <span className="logo-icon">🚨</span>
          <span className="logo-text">SentinelZero</span>
        </div>
        
        <nav className="nav">
          <a href="#dashboard" className="nav-link active">Dashboard</a>
          <a href="#exploits" className="nav-link">Exploits</a>
          <a href="#taxonomy" className="nav-link">Taxonomy</a>
          <a href="#docs" className="nav-link">Docs</a>
        </nav>
        
        <div className="header-actions">
          <button className="btn btn-secondary">Connect Wallet</button>
        </div>
      </div>
    </header>
  );
}

export default Header;

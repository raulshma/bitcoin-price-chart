import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Content from './components/Content';
import halfmoon from 'halfmoon';

function App() {
  halfmoon.onDOMContentLoaded();
  return (
    <div className="page-wrapper with-sidebar with-navbar with-navbar-fixed-bottom with-transitions">
      <Navbar />
      <Content />
      <Footer />
    </div>
  );
}

export default App;

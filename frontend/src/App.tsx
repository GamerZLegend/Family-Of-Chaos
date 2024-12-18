import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Wallet from './pages/Wallet';
import Marketplace from './pages/Marketplace';
import { Web3Provider } from './contexts/Web3Context';

function App() {
  return (
    <ChakraProvider>
      <Web3Provider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/marketplace" element={<Marketplace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </Web3Provider>
    </ChakraProvider>
  );
}

export default App;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider as EthersWeb3Provider } from '@ethersproject/providers';

interface Web3ContextType {
  account: string | null;
  provider: EthersWeb3Provider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  chaosCoinsBalance: string;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<EthersWeb3Provider | null>(null);
  const [chaosCoinsBalance, setChaosCoinsBalance] = useState<string>('0');

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this feature!');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        connectWallet,
        disconnectWallet,
        chaosCoinsBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

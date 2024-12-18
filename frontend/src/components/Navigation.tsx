import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Button, useColorMode } from '@chakra-ui/react';
import { useWeb3 } from '../contexts/Web3Context';

const Navigation: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { account, connectWallet, disconnectWallet } = useWeb3();

  return (
    <Box bg="gray.800" px={4} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Link to="/">
            <Box fontSize="xl" fontWeight="bold">Family of Chaos</Box>
          </Link>
        </Flex>

        <Flex alignItems="center" gap={4}>
          <Link to="/chat">
            <Button variant="ghost" colorScheme="teal">Chat</Button>
          </Link>
          <Link to="/wallet">
            <Button variant="ghost" colorScheme="teal">Wallet</Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="ghost" colorScheme="teal">Marketplace</Button>
          </Link>
          
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? '🌙' : '☀️'}
          </Button>
          
          {account ? (
            <Button
              colorScheme="red"
              onClick={disconnectWallet}
            >
              Disconnect Wallet
            </Button>
          ) : (
            <Button
              colorScheme="green"
              onClick={connectWallet}
            >
              Connect Wallet
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navigation;

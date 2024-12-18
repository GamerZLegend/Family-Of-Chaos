import React from 'react';
import { Box, Heading, Text, SimpleGrid, Button, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const features = [
    {
      title: 'Real-time Chat',
      description: 'Connect with others through text, voice, and video chat',
      link: '/chat'
    },
    {
      title: 'ChaosCoins Wallet',
      description: 'Manage your ChaosCoins and convert to USD',
      link: '/wallet'
    },
    {
      title: 'NFT Marketplace',
      description: 'Trade unique digital assets in our marketplace',
      link: '/marketplace'
    }
  ];

  return (
    <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
      <Box textAlign="center" py={10}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}
        >
          Welcome to{' '}
          <Text as={'span'} color={'teal.400'}>
            Family of Chaos
          </Text>
        </Heading>
        <Text color={'gray.500'} maxW={'3xl'} mx="auto" mt={4}>
          Your gateway to a decentralized community platform with real-time communication,
          cryptocurrency management, and NFT trading.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={10}>
        {features.map((feature, index) => (
          <Box
            key={index}
            bg={bgColor}
            p={6}
            rounded="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="md"
          >
            <Heading fontSize="xl" mb={4}>
              {feature.title}
            </Heading>
            <Text color={'gray.500'} mb={4}>
              {feature.description}
            </Text>
            <Link to={feature.link}>
              <Button colorScheme="teal" size="sm">
                Learn More
              </Button>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Home;

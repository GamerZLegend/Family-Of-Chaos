import React, { useState, useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

const Chat: React.FC = () => {
  const { account } = useWeb3React();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (account) {
      connectWebSocket();
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [account]);

  const connectWebSocket = () => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:4000');
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Intentar reconectar después de 3 segundos
      setTimeout(connectWebSocket, 3000);
    };

    wsRef.current = ws;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !wsRef.current || !account) return;

    try {
      const message = {
        id: ethers.utils.id(Date.now().toString()),
        sender: account,
        content: newMessage,
        timestamp: Date.now(),
      };

      wsRef.current.send(JSON.stringify(message));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Por favor, conecta tu wallet para chatear</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === account ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === account
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!isConnected}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;

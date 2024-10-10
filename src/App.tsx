import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Menu, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface Conversation {
  id: number;
  messages: Message[];
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation>({ id: 0, messages: [] });
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, isUser: true };
    const updatedMessages = [...currentConversation.messages, userMessage];
    setCurrentConversation({ ...currentConversation, messages: updatedMessages });
    setInput('');

    // Mock API response
    setTimeout(() => {
      const botMessage: Message = { id: (Date.now() + 1).toString(), text: `You said: "${input}". This is a mock response.`, isUser: false };
      const finalMessages = [...updatedMessages, botMessage];
      setCurrentConversation({ ...currentConversation, messages: finalMessages });

      // Update conversations list
      setConversations(prevConversations => {
        const existingConversationIndex = prevConversations.findIndex(c => c.id === currentConversation.id);
        if (existingConversationIndex !== -1) {
          const updatedConversations = [...prevConversations];
          updatedConversations[existingConversationIndex] = { ...currentConversation, messages: finalMessages };
          return updatedConversations;
        } else {
          return [...prevConversations, { ...currentConversation, messages: finalMessages }];
        }
      });
    }, 500); // Simulate a delay
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation.messages]);

  const startNewConversation = () => {
    const newId = conversations.length > 0 ? Math.max(...conversations.map(c => c.id)) + 1 : 1;
    const newConversation: Conversation = { id: newId, messages: [] };
    setConversations([...conversations, newConversation]);
    setCurrentConversation(newConversation);
    setIsSidebarOpen(false);
  };

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-100"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Recent Chats</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <button onClick={startNewConversation} className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4 transition-colors duration-200">
                New Chat
              </button>
              {conversations.slice().reverse().map((conv) => (
                <motion.div
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className="cursor-pointer p-2 hover:bg-gray-200 rounded-lg mb-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm truncate">
                      {conv.messages.length > 0
                        ? conv.messages[0].text.substring(0, 30) + '...'
                        : 'Empty conversation'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-col w-full">
        <header className="bg-white border-b">
          <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <motion.button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 -ml-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
            <h1 className="text-2xl font-semibold text-gray-900">SELF JUSTICE -- YOUR LEGAL AI</h1>
            <div className="w-6 h-6"></div> {/* Placeholder for symmetry */}
          </div>
        </header>
        <main className="flex-grow flex flex-col justify-center items-center px-4 overflow-hidden">
          {currentConversation.messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How can I help you today?</h2>
              <p className="text-lg text-gray-600">Ask me anything!</p>
            </motion.div>
          ) : (
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm overflow-hidden flex-grow flex flex-col">
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {currentConversation.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-xl ${
                          message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full ${
                            message.isUser
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {message.isUser ? (
                            <User className="w-5 h-5" />
                          ) : (
                            <Bot className="w-5 h-5" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            message.isUser
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mt-4 mb-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Message ChatGPT..."
              />
              <motion.button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </form>
        </main>
        <footer className="text-center py-4 text-sm text-gray-500">
          Legal AI can make mistakes. Check important info.
        </footer>
      </div>
    </div>
  );
}
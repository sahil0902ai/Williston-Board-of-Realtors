'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Welcome to the Williston Board of Realtors & Investments. I am your virtual wealth advisor. How can I help you build generational wealth today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages container
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuery = inputValue.toLowerCase();
    setInputValue('');

    // Simulate AI Typing
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';

      if (userQuery.includes('payout') || userQuery.includes('withdraw') || userQuery.includes('method')) {
        replyText = 'Williston supports secure US-based payout methods: \n• Cash App (Minimum $100)\n• Zelle Transfer (Minimum $100)\n• Crypto Withdrawal (BTC/USDT/ETH, Minimum $200)\n• Bank Account ACH (Minimum $500). Payouts are requested through the Wallet tab.';
      } else if (userQuery.includes('minimum') || userQuery.includes('limit') || userQuery.includes('price')) {
        replyText = 'Investment minimums:\n• Financial packages (Foundation plan): $500\n• Commercial House investments: $40,000\n• Standard House investments: $80,000\n• Luxury House properties: $300,000.';
      } else if (userQuery.includes('referral') || userQuery.includes('commission') || userQuery.includes('partner')) {
        replyText = 'Our Partner Program pays a 5% to 10% instant commission deposited directly into your withdrawable wallet on your invitee\'s first investment cycle.';
      } else if (userQuery.includes('contact') || userQuery.includes('email') || userQuery.includes('telegram') || userQuery.includes('support')) {
        replyText = 'You can reach us at:\n• Email: willistonboardofrealtors@gmail.com\n• Telegram: @willistonboardofrealtors\n• Phone: +1 (713) 000-0000';
      } else if (userQuery.includes('roi') || userQuery.includes('returns') || userQuery.includes('interest')) {
        replyText = 'Our property tiers deliver high returns:\n• Commercial House: 22–28% per annum\n• Standard House: 18–24% per annum\n• Luxury House: 30–40% per annum. Returns are paid at maturity.';
      } else {
        replyText = 'Thank you for your question. You can connect with our professional relationship managers directly via Telegram (@willistonboardofrealtors) or email us at willistonboardofrealtors@gmail.com for personalized investment guidance.';
      }

      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[998] flex flex-col items-end">
      {/* Chat Window */}
      <div
        id="chatWindow"
        className={`w-[340px] sm:w-[380px] h-[500px] bg-navy-mid border border-border-gold rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-navy p-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold flex items-center justify-center text-gold">
              <Bot size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Williston AI Advisor</div>
              <div className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
              </div>
            </div>
          </div>
          <button
            onClick={handleToggle}
            className="text-gray-text hover:text-white transition-colors"
            aria-label="Close Chat"
            suppressHydrationWarning
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div
          id="chatMessages"
          ref={chatMessagesRef}
          className="flex-1 p-4 overflow-y-auto space-y-4 bg-navy/30 scroll-smooth"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-xs ${
                  msg.sender === 'user'
                    ? 'bg-gold border-gold text-navy'
                    : 'bg-navy border-border-subtle text-gold'
                }`}
              >
                {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div
                className={`p-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gold text-navy rounded-tr-none'
                    : 'bg-navy-light text-white rounded-tl-none border border-border-subtle'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div
              id="typingIndicator"
              className="flex items-start gap-2 max-w-[80%]"
              style={{ display: 'flex' }}
            >
              <div className="w-7 h-7 rounded-full bg-navy border border-border-subtle text-gold flex items-center justify-center shrink-0">
                <Bot size={12} />
              </div>
              <div className="bg-navy-light border border-border-subtle text-gray-text p-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 bg-navy border-t border-border-subtle flex gap-2">
          <input
            id="chatInput"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about payouts, ROI, minimums..."
            className="flex-1 bg-navy-mid border border-border-subtle rounded-xl px-4 py-3 text-sm text-white placeholder-gray-text/50 focus:border-gold focus:outline-none"
            suppressHydrationWarning
          />
          <button
            onClick={handleSendMessage}
            className="w-11 h-11 bg-gold hover:bg-gold-light text-navy rounded-xl flex items-center justify-center shrink-0 transition-colors"
            aria-label="Send Message"
            suppressHydrationWarning
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        id="chatToggle"
        onClick={handleToggle}
        className="w-14 h-14 bg-gold hover:bg-gold-light text-navy rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105"
        aria-label="Open chat assistant"
        suppressHydrationWarning
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}

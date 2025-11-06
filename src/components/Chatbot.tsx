'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/design-system';
import { useRealm } from '@/contexts/RealmContext';
// Removed useChat import - managing messages manually

// Modern AI Chatbot with beautiful animations
export default function Chatbot() {
  const { currentRealm } = useRealm();
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('Noble Lord');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fetch username from the same API the dashboard uses
  useEffect(() => {
    const fetchUserName = async () => {
      if (!currentRealm) return;
      
      try {
        const response = await fetch(`/api/dashboard/user-data?realmId=${currentRealm.id}`);
        if (response.ok) {
          const data = await response.json();
          // Use the same username field the dashboard uses
          const name = data.username || 'Noble Lord';
          // Clean the name the same way the dashboard does
          const cleanName = !name || name === "null" || name.trim() === "" ? "Noble Lord" : name.trim();
          setUserName(cleanName);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
    
    fetchUserName();
  }, [currentRealm]);

  // Auto-scroll to the bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Debug: Log messages when they change
  useEffect(() => {
    console.log('Messages updated:', messages.length, 'messages');
    messages.forEach((m, i) => {
      console.log(`Message ${i}:`, {
        id: m.id,
        role: m.role,
        contentLength: m.content?.length || 0,
        contentPreview: typeof m.content === 'string' ? m.content.substring(0, 50) : 'not a string',
      });
    });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = inputValue.trim();
    setInputValue(''); // Clear input immediately
    
    // Add user message to the messages array
    const userMsg = { role: 'user' as const, content: userMessage, id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    // Send to API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        
        // Handle authentication errors specifically
        if (response.status === 401) {
          try {
            const errorData = JSON.parse(errorText);
            setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: errorData.message || 'You must be logged in to use the Realm Advisor. Please sign in or create an account to continue.',
            }]);
          } catch {
            setMessages(prev => [...prev, {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: 'You must be logged in to use the Realm Advisor. Please sign in or create an account to continue.',
            }]);
          }
          setIsLoading(false);
          return;
        }
        
        throw new Error(`Failed to get response: ${response.status}`);
      }

      // Handle streaming response - AI SDK v5 uses Server-Sent Events format
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }
      
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();
      let buffer = '';
      let hasStarted = false;

      console.log('Starting to read stream...');
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream done');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log('Raw chunk received:', chunk.substring(0, 100));
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
            if (line.trim() === '') continue;
            
            // Log all non-empty lines to see what we're getting
            console.log('Processing line:', line.substring(0, 150));
            
            // AI SDK v5 format: "0:{"type":"text-delta","delta":"text","id":"..."}"
            // Also check for "data:" prefix (SSE format)
            const lineToParse = line.startsWith('data:') ? line.slice(5).trim() : line;
            
            if (lineToParse.startsWith('0:') || line.startsWith('data:')) {
              const jsonStr = lineToParse.startsWith('0:') ? lineToParse.slice(2) : (line.startsWith('data:') ? line.slice(5).trim() : lineToParse);
              try {
                const data = JSON.parse(jsonStr);
                console.log('Parsed data:', { type: data.type, hasDelta: !!data.delta, deltaLength: data.delta?.length || 0 });
                
                if (data.type === 'text-delta' && data.delta) {
                  assistantContent += data.delta;
                  console.log('Text delta received, current length:', assistantContent.length, 'delta:', data.delta.substring(0, 50));
                  
                  // Update assistant message in real-time
                  setMessages(prev => {
                    const existing = prev.find(m => m.id === assistantId);
                    if (existing) {
                      return prev.map(m => 
                        m.id === assistantId 
                          ? { ...m, content: assistantContent }
                          : m
                      );
                    } else {
                      // Create message if it doesn't exist (in case text-start was missed)
                      console.log('Creating new assistant message');
                      return [...prev, { id: assistantId, role: 'assistant' as const, content: assistantContent }];
                    }
                  });
                } else if (data.type === 'text-start') {
                  // Initialize assistant message
                  assistantContent = '';
                  hasStarted = true;
                  setMessages(prev => {
                    // Don't add if it already exists
                    const existing = prev.find(m => m.id === assistantId);
                    if (!existing) {
                      return [...prev, { id: assistantId, role: 'assistant' as const, content: '' }];
                    }
                    return prev;
                  });
                  console.log('Text start received, assistantId:', assistantId);
                } else if (data.type === 'text-end') {
                  // Message complete
                  console.log('Message complete, total length:', assistantContent.length);
                  // Ensure final content is set
                  if (assistantContent.length > 0) {
                    setMessages(prev => {
                      const existing = prev.find(m => m.id === assistantId);
                      if (existing && existing.content !== assistantContent) {
                        return prev.map(m => 
                          m.id === assistantId 
                            ? { ...m, content: assistantContent }
                            : m
                        );
                      }
                      return prev;
                    });
                  }
                }
              } catch (e) {
                // Log parse errors to help debug
                if (line.length > 0 && !line.includes('data:')) {
                  console.log('Parse error for line:', line.substring(0, 100), e);
                }
              }
            }
          }
        }
        
        // Process any remaining buffer
        if (buffer.trim()) {
          if (buffer.startsWith('0:')) {
            try {
              const jsonStr = buffer.slice(2);
              const data = JSON.parse(jsonStr);
              if (data.type === 'text-delta' && data.delta) {
                assistantContent += data.delta;
                setMessages(prev => {
                  const existing = prev.find(m => m.id === assistantId);
                  if (existing) {
                    return prev.map(m => 
                      m.id === assistantId 
                        ? { ...m, content: assistantContent }
                        : m
                    );
                  } else {
                    return [...prev, { id: assistantId, role: 'assistant' as const, content: assistantContent }];
                  }
                });
              }
            } catch (e) {
              console.log('Final buffer parse error:', e);
            }
          }
        }
        
      console.log('Stream finished. Final content length:', assistantContent.length);
      if (assistantContent.length === 0 && !hasStarted) {
        console.warn('No content received from stream');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={toggleChatbot}
        className={cn(
          "fixed bottom-6 right-6 z-[100] rounded-full shadow-2xl",
          "bg-gradient-to-br from-[var(--theme-gold)] to-[var(--theme-gold-dark)]",
          "hover:shadow-[0_0_40px_rgba(234,179,8,0.6)]",
          "transition-all duration-300",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Pulse animation ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[var(--theme-gold)]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Icon */}
          <span className="text-3xl relative z-10">🤖</span>
          
          {/* Notification badge (if there are messages) */}
          {messages.length > 0 && !isOpen && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-crimson-500 rounded-full border-2 border-[var(--theme-bg)] flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <span className="text-xs text-white font-bold">{messages.length}</span>
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-[100] w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]"
            initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex flex-col h-full rounded-2xl backdrop-blur-xl border-2 border-[var(--theme-border)] shadow-2xl overflow-hidden bg-[var(--theme-card-bg)]">
              {/* Header */}
              <motion.div
                className="relative p-5 border-b border-[var(--theme-border)] bg-gradient-to-r from-[var(--theme-gold)]/10 to-transparent"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--theme-gold)] to-[var(--theme-gold-dark)] flex items-center justify-center shadow-lg">
                        <span className="text-xl">🤖</span>
                      </div>
                      {/* Online indicator */}
                      <motion.div
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--theme-card-bg)]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <h3 className="font-[Cinzel] text-lg text-[var(--theme-gold)] font-semibold">
                        Realm Advisor
                      </h3>
                      <p className="text-xs text-gray-400">
                        {isLoading ? "Thinking..." : "Online"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Close button */}
                  <motion.button
                    onClick={toggleChatbot}
                    className="w-8 h-8 rounded-full hover:bg-[var(--theme-gold)]/20 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-[var(--theme-gold)] text-xl">×</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Messages Container */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[var(--theme-gold)]/30 scrollbar-track-transparent"
              >
                {messages.length === 0 && (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full text-center px-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--theme-gold)]/20 to-transparent flex items-center justify-center mb-4">
                      <span className="text-4xl">👋</span>
                    </div>
                    <h4 className="font-[Cinzel] text-[var(--theme-gold)] text-lg mb-2">
                      Welcome, {userName}!
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Ask me about the rules of the realm or seek strategic advice for your kingdom.
                    </p>
                  </motion.div>
                )}

                {messages.map((m, index) => {
                  // Get content - should be a string
                  const content = typeof m.content === 'string' ? m.content : String(m.content || '');

                  return (
                    <motion.div
                      key={m.id}
                      className={cn(
                        "flex",
                        m.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 shadow-lg",
                          m.role === 'user'
                            ? "bg-gradient-to-br from-[var(--theme-gold)] to-[var(--theme-gold-dark)] text-slate-900"
                            : "bg-gradient-to-br from-steel-800/80 to-steel-900/80 backdrop-blur-sm border border-[var(--theme-border)] text-gray-100"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-[Cinzel] font-semibold opacity-80">
                            {m.role === 'user' ? '👤 You' : '🤖 Advisor'}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-[Playfair_Display]">
                          {content || '(empty message)'}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing Indicator */}
                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gradient-to-br from-steel-800/80 to-steel-900/80 backdrop-blur-sm border border-[var(--theme-border)] rounded-2xl px-5 py-3 shadow-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-[Cinzel] font-semibold text-gray-400 mb-1">
                          🤖 Advisor is thinking...
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-[var(--theme-gold)] rounded-full"
                            animate={{
                              y: [0, -8, 0],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Form */}
              <motion.form
                onSubmit={onSubmit}
                className="p-4 border-t border-[var(--theme-border)] bg-gradient-to-t from-[var(--theme-gold)]/5 to-transparent"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask for disciplined advice..."
                      disabled={isLoading}
                      className={cn(
                        "w-full px-4 py-3 pr-12 rounded-xl",
                        "bg-steel-900/50 backdrop-blur-sm",
                        "border-2 border-[var(--theme-border)]",
                        "text-black placeholder-gray-500",
                        "focus:outline-none focus:border-[var(--theme-accent)] focus:ring-4 focus:ring-[var(--theme-gold)]/20",
                        "transition-all duration-300",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    />
                    {/* Character count or send hint */}
                    {inputValue.length > 0 && (
                      <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <span className="text-xs text-gray-500">
                          {inputValue.length}
                        </span>
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br from-[var(--theme-gold)] to-[var(--theme-gold-dark)]",
                      "shadow-lg hover:shadow-xl",
                      "transition-all duration-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      !isLoading && inputValue.trim() && "hover:scale-105 active:scale-95"
                    )}
                    whileHover={!isLoading && inputValue.trim() ? { scale: 1.05 } : {}}
                    whileTap={!isLoading && inputValue.trim() ? { scale: 0.95 } : {}}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <svg
                        className="w-5 h-5 text-slate-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    )}
                  </motion.button>
                </div>
                
                {/* Quick suggestions */}
                {messages.length === 0 && (
                  <motion.div
                    className="mt-3 flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[
                      "What are the rules?",
                      "How do I build cities?",
                      "Strategic advice",
                    ].map((suggestion, i) => (
                      <motion.button
                        key={i}
                        type="button"
                        onClick={() => {
                          // Set input value and trigger submit
                          setInputValue(suggestion);
                          // Trigger form submission
                          setTimeout(() => {
                            const form = inputRef.current?.closest('form');
                            if (form) {
                              const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                              form.dispatchEvent(submitEvent);
                            }
                          }, 0);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg bg-[var(--theme-gold)]/10 border border-[var(--theme-border)] text-[var(--theme-gold)] hover:bg-[var(--theme-gold)]/20 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
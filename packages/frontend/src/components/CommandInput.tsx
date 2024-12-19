import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntent } from '@/hooks/useIntent';

const CommandInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const intentMutation = useIntent({
    onSuccess: () => {
      setInput('');
      setIsOpen(false);
    },
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await intentMutation.mutateAsync(input);
    }
  }, [input, intentMutation]);

  // Toggle command input with Cmd/Ctrl + K
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  }, []);

  // Add keyboard event listener
  useState(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 w-[600px] z-50"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What would you like to do? (e.g., 'Plan a product launch')"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            {intentMutation.isPending && (
              <div className="px-4 py-2 text-sm text-gray-500">
                Processing your request...
              </div>
            )}
            {intentMutation.isError && (
              <div className="px-4 py-2 text-sm text-red-500">
                Error: {intentMutation.error.message}
              </div>
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandInput; 
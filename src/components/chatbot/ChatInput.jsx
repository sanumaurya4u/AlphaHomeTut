import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ input, setInput, onSend, disabled }) {
  const textareaRef = useRef(null);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    // If Enter (without Shift) and not mobile/tablet soft keyboard
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && input.trim()) {
        onSend();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled && input.trim()) {
      onSend();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4 bg-white flex items-end gap-2">
      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about Alpha Home Tuition..."
          rows={1}
          disabled={disabled}
          className="w-full bg-transparent border-0 outline-none resize-none text-sm text-gray-800 placeholder-gray-400 max-h-32 py-1 leading-normal focus:ring-0 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="w-10 h-10 bg-primary text-white hover:bg-primary-light disabled:bg-gray-200 disabled:text-gray-400 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 shadow-sm"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}

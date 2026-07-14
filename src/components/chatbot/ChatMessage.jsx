import { useState } from 'react';
import { Copy, Check, HelpCircle } from 'lucide-react';

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const timestamp = message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Basic markdown & line break parser for lightweight rendering
  const renderMessageContent = (text) => {
    if (!text) return null;

    // Split text by lines
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Check if line is a bullet point (starts with - or * followed by space)
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const content = parseInlineMarkdown(line.trim().substring(2));
        return (
          <li key={idx} className="ml-4 list-disc mb-1 text-sm md:text-[14px] leading-relaxed">
            {content}
          </li>
        );
      }

      // Regular line
      const content = parseInlineMarkdown(line);
      return (
        <p key={idx} className="mb-2 last:mb-0 text-sm md:text-[14px] leading-relaxed break-words">
          {content}
        </p>
      );
    });
  };

  const parseInlineMarkdown = (text) => {
    // Parse bold: **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-primary-dark">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className="max-w-[85%] sm:max-w-[75%] flex flex-col">
        {/* Message Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-primary text-white rounded-tr-none'
              : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
          }`}
        >
          {/* FAQ Label for instant answers */}
          {message.isFaq && !isUser && (
            <div className="flex items-center gap-1 text-[10px] text-secondary font-semibold uppercase tracking-wider mb-1.5">
              <HelpCircle className="w-3 h-3" />
              Instant FAQ Answer
            </div>
          )}

          {/* Typing Indicator */}
          {message.isTyping ? (
            <div className="flex items-center gap-1.5 py-1.5 px-1">
              <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <div className="whitespace-pre-line">
              {renderMessageContent(message.content)}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between mt-2 text-[10px] opacity-60">
            <span>{timestamp}</span>
            
            {!isUser && !message.isTyping && (
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 ml-2 p-1 hover:bg-gray-200/50 rounded transition-all cursor-pointer"
                title="Copy message"
              >
                {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

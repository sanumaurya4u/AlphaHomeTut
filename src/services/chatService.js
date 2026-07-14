import { faqs } from '@/data/faqs';
import { supabase } from '@/supabase/config';

// Stop words to filter out for better keyword match scoring
const STOP_WORDS = new Set([
  'how', 'do', 'i', 'is', 'are', 'am', 'a', 'an', 'the', 'you', 'your', 'we', 'our', 'us',
  'to', 'for', 'in', 'on', 'at', 'can', 'of', 'what', 'which', 'who', 'where', 'why', 'have',
  'please', 'want', 'need', 'with', 'about', 'get', 'give'
]);

function normalizeAndTokenize(text) {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 0);
}

export function findMatchingFAQ(query) {
  const queryTokens = normalizeAndTokenize(query);
  if (queryTokens.length === 0) return null;

  const queryKeyTokens = queryTokens.filter(token => !STOP_WORDS.has(token));
  
  let bestMatch = null;
  let highestScore = 0;

  for (const faq of faqs) {
    const questionTokens = normalizeAndTokenize(faq.question);
    const questionKeyTokens = questionTokens.filter(token => !STOP_WORDS.has(token));
    
    // Count general token overlap
    let matchCount = 0;
    queryTokens.forEach(token => {
      if (questionTokens.includes(token)) {
        matchCount += 1.0;
      }
    });

    // Count key token overlap (heavier weight)
    let keyMatchCount = 0;
    queryKeyTokens.forEach(token => {
      if (questionKeyTokens.includes(token)) {
        keyMatchCount += 3.0;
      }
    });

    const score = matchCount + keyMatchCount;
    
    // Require a minimum score to consider it a valid match
    if (score > highestScore && score >= 4.0) {
      highestScore = score;
      bestMatch = faq;
    }
  }

  // Fallback: Check direct substring keyword patterns
  if (!bestMatch) {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('fee') || lowercaseQuery.includes('cost') || lowercaseQuery.includes('price') || lowercaseQuery.includes('charge') || lowercaseQuery.includes('rupees') || lowercaseQuery.includes('payment') || lowercaseQuery.includes('package')) {
      return faqs.find(f => f.id === 4); // What are the fees?
    }
    if (lowercaseQuery.includes('lady') || lowercaseQuery.includes('female') || lowercaseQuery.includes('woman') || lowercaseQuery.includes('girl') || lowercaseQuery.includes('women')) {
      return faqs.find(f => f.id === 7); // Do you provide lady teachers?
    }
    if (lowercaseQuery.includes('verify') || lowercaseQuery.includes('verific') || lowercaseQuery.includes('background') || lowercaseQuery.includes('safe') || lowercaseQuery.includes('trust') || lowercaseQuery.includes('genuine')) {
      return faqs.find(f => f.id === 2); // Are tutors verified?
    }
    if (lowercaseQuery.includes('online') || lowercaseQuery.includes('virtual') || lowercaseQuery.includes('zoom') || lowercaseQuery.includes('google meet') || lowercaseQuery.includes('video')) {
      return faqs.find(f => f.id === 3); // Do you provide online classes?
    }
    if (lowercaseQuery.includes('change') || lowercaseQuery.includes('replace') || lowercaseQuery.includes('another') || lowercaseQuery.includes('dissatisfied') || lowercaseQuery.includes('not satisfied')) {
      return faqs.find(f => f.id === 5); // Can I change my tutor later?
    }
    if (lowercaseQuery.includes('class') || lowercaseQuery.includes('board') || lowercaseQuery.includes('cbse') || lowercaseQuery.includes('icse') || lowercaseQuery.includes('bihar board') || lowercaseQuery.includes('jee') || lowercaseQuery.includes('neet')) {
      return faqs.find(f => f.id === 6); // Which classes and boards do you cover?
    }
    if (lowercaseQuery.includes('find') || lowercaseQuery.includes('hire') || lowercaseQuery.includes('get tutor') || lowercaseQuery.includes('book') || lowercaseQuery.includes('request tutor')) {
      return faqs.find(f => f.id === 1); // How do I find a tutor?
    }
  }

  return bestMatch;
}

export async function sendChatMessage(message, history = []) {
  // 1. Try static FAQ first
  const faqMatch = findMatchingFAQ(message);
  if (faqMatch) {
    return {
      response: faqMatch.answer,
      isFaq: true,
      faqQuestion: faqMatch.question
    };
  }

  // 2. Call Supabase Edge Function as fallback
  try {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { message, history }
    });

    if (error) {
      console.error('Edge function invocation error:', error);
      throw error;
    }

    if (!data || typeof data.response !== 'string') {
      throw new Error('Invalid response structure received from assistant');
    }

    return {
      response: data.response,
      isFaq: false
    };
  } catch (err) {
    console.error('sendChatMessage exception:', err);
    throw new Error(err.message || 'Failed to reach AI Assistant. Please check your network connection.');
  }
}

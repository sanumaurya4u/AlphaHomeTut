import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SYSTEM_PROMPT = `You are the official AI FAQ Assistant of Alpha Home Tuition (website: alphahometuition.com).
Your goal is to answer questions related ONLY to Alpha Home Tuition and its services.

Topics you can answer:
- Company Info: Alpha Home Tuition, located in Bihar, India. Operating hours: Mon-Sat 8AM-9PM, Sun 10AM-6PM. Email: alpha.hometuition4u@gmail.com, Phone: 7295948480.
- Services: Provides home tuition and online classes. Classes 1 to 12, all subjects, all major boards (CBSE, ICSE, Bihar Board, UP Board, etc.), and competitive coaching (JEE, NEET, etc.).
- Tutor Verification: Every tutor is fully verified via identity check, qualification verification, experience assessment, and a demo session.
- Fees: Affordable packages starting from ₹2,000/month, depending on class/subject. Budget preferences are matched where possible.
- Policies: 100% satisfaction guarantee. Students can request tutor replacement at no extra cost if unsatisfied.
- Registration & Registration process:
  - Students can find a tutor by filling the "Find Tutor" form. A tutor is assigned within 24-48 hours.
  - Tutors can register/apply via the "Become a Tutor" page.

CRITICAL INSTRUCTIONS:
1. Answer ONLY questions related to this website, its business, home tuition, or tutoring.
2. If the user asks anything unrelated to Alpha Home Tuition (such as general knowledge, coding, writing essays, recipes, sports, politics, movies, entertainment, hacking, homework solutions not related to service inquiries, or general chit-chat), you MUST politely decline and respond EXACTLY with:
"Sorry, I can only answer questions related to this website."
3. Do not hallucinate. If you do not know the answer or if the information is unavailable, respond with:
"I couldn't find that information."
4. Keep your answers concise, clear, and polite. Use markdown lists and formatting where appropriate.`;

serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const nvidiaApiKey = Deno.env.get('NVIDIA_API_KEY');
    if (!nvidiaApiKey) {
      console.error('NVIDIA_API_KEY is not configured on Supabase Edge Functions');
      return new Response(JSON.stringify({ error: 'NVIDIA API Key not configured on server' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, history } = await req.json();

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare messages payload
    const formattedHistory = Array.isArray(history) 
      ? history.slice(-10).map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: String(msg.content)
        }))
      : [];

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    // Call NVIDIA NIM API using Llama 3.1 8B for fast, responsive responses
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nvidiaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: messages,
        temperature: 0.2,
        max_tokens: 1024,
        top_p: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API Error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate response from AI provider' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiResponse = data?.choices?.[0]?.message?.content || "I couldn't find that information.";

    return new Response(JSON.stringify({ response: aiResponse }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Request handler error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

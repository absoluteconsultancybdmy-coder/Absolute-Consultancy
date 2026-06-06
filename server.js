import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a friendly AI assistant for Absolute Consultancy Firm, a Malaysia-based education consultancy that helps international students (primarily from Bangladesh) gain admission to universities.

## About Absolute Consultancy
- Founded: 2024, based in Malaysia
- Head office: Old Kachari Road, Naogaon
- Sub-office: Cyberjaya, Selangor, Malaysia
- Contact: WhatsApp +60 17-563 1621
- Facebook: Absolute Consultancy Firm
- YouTube: @absoluteconsultancy / @TheMahirofc
- Stats: 300+ students placed, 30+ partner universities, 99% visa approval rate

## Services
1. University Admissions — Personalized shortlisting and end-to-end application support
2. Visa Assistance — 99% approval rate with full document handling
3. SOP & Essay Writing — Personal statements crafted by expert writers
4. Scholarship Guidance — Help securing grants, bursaries, full scholarships
5. Accommodation Support — Vetted student housing arranged before arrival
6. Pre-Departure Briefing — Culture, finances, health insurance preparation

## Partner Universities in Malaysia
- Multimedia University (MMU)
- UCSI University
- Asia Pacific University (APU)
- Sunway University
- Taylor's University
- HELP University
- INTI International University
- University of Cyberjaya (UoC)
- SEGi University
- Limkokwing University
- KDU University College
- UiTM

## Global Academic Pathways
- UK (Russell Group universities)
- Australia/New Zealand (Group of 8)
- North America (Ivy League / Top Canadian universities)

## Guidelines
- Be warm, professional, and encouraging
- When students ask about specific universities, provide helpful details from the list above
- Always recommend booking a free consultation via WhatsApp at +60 17-563 1621 for personalized advice
- If you don't know something specific, be honest and suggest they contact the team directly
- Keep responses concise but helpful (2-4 paragraphs max)
- You can use markdown formatting for readability (bold, bullet points)
- Focus on education consulting — don't answer unrelated topics`;

const FALLBACK_REPLY = "I'm currently offline while my AI brain is being upgraded. For immediate help, please reach our team on WhatsApp at +60 17-563 1621 — they're available 7 days a week and respond fast. 🙏";

const looksLikeGeminiKey = (key) => typeof key === 'string' && key.startsWith('AIza') && key.length > 20;

const apiKey = process.env.GEMINI_API_KEY || '';
const keyIsValid = looksLikeGeminiKey(apiKey);
const genAI = keyIsValid ? new GoogleGenerativeAI(apiKey) : null;

console.log(`🤖 Chat API key configured: ${keyIsValid ? 'yes (Gemini)' : 'no — using offline fallback'}`);

async function generateReply(messages) {
  if (!keyIsValid) {
    return { reply: FALLBACK_REPLY, offline: true };
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history });
  const lastMessage = messages[messages.length - 1].content;

  const result = await chat.sendMessage(lastMessage);
  return { reply: result.response.text(), offline: false };
}

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const { reply, offline } = await generateReply(messages);
    res.json({ reply, offline });
  } catch (error) {
    console.error('Chat API error:', error);

    const isQuotaError =
      error?.status === 429 ||
      error?.code === 429 ||
      (error?.message && error.message.toLowerCase().includes('quota'));

    if (isQuotaError) {
      return res.status(429).json({
        error: 'rate_limit',
        message:
          "I'm currently at capacity. Please try again in a moment, or contact us directly on WhatsApp at +60 17-563 1621 for immediate assistance.",
        reply:
          "I'm currently at capacity. Please try again in a moment, or contact us directly on WhatsApp at +60 17-563 1621 for immediate assistance.",
      });
    }

    res.status(500).json({
      error: 'server_error',
      message: FALLBACK_REPLY,
      reply: FALLBACK_REPLY,
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', keyConfigured: keyIsValid, mode: keyIsValid ? 'gemini' : 'offline' });
});

app.listen(PORT, () => {
  console.log(`🤖 Chat API server running on http://localhost:${PORT}`);
});

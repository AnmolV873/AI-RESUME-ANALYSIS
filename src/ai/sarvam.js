import { env } from '../config/env.js';
import { AppError } from '../middleware/error.middleware.js';

const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';
const SARVAM_MODEL = 'sarvam-m';

/**
 * Send a prompt to Sarvam AI and get a text response back.
 * @param {string} systemPrompt - Instructions telling the AI how to behave
 * @param {string} userMessage - The actual content to analyze
 * @returns {Promise<string>} - Raw text response from the AI
 */
export const callSarvam = async (systemPrompt, userMessage) => {
  const response = await fetch(SARVAM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': env.SARVAM_API_KEY,
    },
    body: JSON.stringify({
      model: SARVAM_MODEL,
      temperature: 0.2,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new AppError(`Sarvam API error: ${response.status} - ${error}`, 502);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new AppError('Sarvam API returned an empty response', 502);
  }

  return content.trim();
};

/**
 * Call Sarvam and parse the response as JSON.
 * The prompt must instruct the AI to respond with JSON only.
 */
export const callSarvamJSON = async (systemPrompt, userMessage) => {
  const raw = await callSarvam(systemPrompt, userMessage);

  // Strip markdown code fences if AI wraps response in ```json ... ```
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new AppError(`AI returned invalid JSON: ${cleaned.slice(0, 200)}`, 502);
  }
};
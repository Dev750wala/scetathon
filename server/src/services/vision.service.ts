import getOpenAIClient from '../config/openai.js';
import { AIAnalysisResult, VisionVerificationResult } from '../types/index.js';

export async function analyzeComplaintImage(imageUrl: string): Promise<AIAnalysisResult> {
  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a campus sanitation inspection AI. Analyze this image of a reported sanitation issue.
Respond ONLY with valid JSON:
{
  "category": "WASTE|SPILL|ODOR|GRAFFITI|BROKEN_FIXTURE|OTHER",
  "severity": "LOW|MEDIUM|HIGH|CRITICAL",
  "isValid": true or false (is this actually a sanitation issue?),
  "confidence": 0.0-1.0,
  "description": "what you see in the image"
}`,
            },
            { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
          ],
        },
      ],
      max_tokens: 300,
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch {
    return { category: 'OTHER', severity: 'LOW', isValid: true, confidence: 0.3, description: 'Analysis unavailable' };
  }
}

export async function verifyResolution(beforeUrl: string, afterUrl: string): Promise<VisionVerificationResult> {
  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Compare these two images: the BEFORE image shows a sanitation issue, and the AFTER image should show it resolved.
Respond ONLY with valid JSON:
{
  "isResolved": true or false,
  "confidence": 0.0-1.0,
  "notes": "brief explanation of your assessment"
}`,
            },
            { type: 'text', text: 'BEFORE image:' },
            { type: 'image_url', image_url: { url: beforeUrl } },
            { type: 'text', text: 'AFTER image:' },
            { type: 'image_url', image_url: { url: afterUrl } },
          ],
        },
      ],
      max_tokens: 200,
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch {
    return { isResolved: false, confidence: 0, notes: 'Verification unavailable' };
  }
}

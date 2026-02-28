import getOpenAIClient from '../config/openai.js';
import { AIAnalysisResult, VisionVerificationResult, ReportCategory, ReportSeverity } from '../types/index.js';

export async function classifyReport(title: string, description: string): Promise<AIAnalysisResult> {
  try {
    const client = getOpenAIClient();
    const prompt = `You are a campus sanitation classifier. Analyze the following complaint and respond ONLY with JSON.

Title: ${title}
Description: ${description}

Respond with this exact JSON structure:
{
  "category": "WASTE|SPILL|ODOR|GRAFFITI|BROKEN_FIXTURE|OTHER",
  "severity": "LOW|MEDIUM|HIGH|CRITICAL",
  "isValid": true|false,
  "confidence": 0.0-1.0,
  "description": "brief analysis"
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 200,
    });

    const content = response.choices[0].message.content || '{}';
    const result = JSON.parse(content);
    return {
      category: result.category as ReportCategory,
      severity: result.severity as ReportSeverity,
      isValid: Boolean(result.isValid),
      confidence: Number(result.confidence) || 0.5,
      description: String(result.description || ''),
    };
  } catch {
    return {
      category: 'OTHER',
      severity: 'LOW',
      isValid: true,
      confidence: 0.5,
      description: 'Classification unavailable',
    };
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient();
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

export async function analyzeImage(imageUrl: string): Promise<AIAnalysisResult> {
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
              text: 'Analyze this campus sanitation complaint image. Respond ONLY with JSON: {"category":"WASTE|SPILL|ODOR|GRAFFITI|BROKEN_FIXTURE|OTHER","severity":"LOW|MEDIUM|HIGH|CRITICAL","isValid":true/false,"confidence":0.0-1.0,"description":"brief description"}',
            },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 200,
    });

    const content = response.choices[0].message.content || '{}';
    const result = JSON.parse(content);
    return {
      category: result.category as ReportCategory,
      severity: result.severity as ReportSeverity,
      isValid: Boolean(result.isValid),
      confidence: Number(result.confidence) || 0.5,
      description: String(result.description || ''),
    };
  } catch {
    return {
      category: 'OTHER',
      severity: 'LOW',
      isValid: true,
      confidence: 0.5,
      description: 'Image analysis unavailable',
    };
  }
}

export async function generateInsightDescription(pattern: object): Promise<string> {
  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Generate a brief, actionable insight for campus sanitation managers based on this data pattern: ${JSON.stringify(pattern)}. Keep it under 100 words.`,
        },
      ],
      max_tokens: 150,
    });
    return response.choices[0].message.content || 'Pattern detected requiring attention.';
  } catch {
    return 'Pattern detected requiring attention.';
  }
}

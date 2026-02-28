import getOpenAIClient from '../config/openai.js';

export async function processTranscript(transcript: string, language: string = 'en'): Promise<{
  englishText: string;
  category: string;
  severity: string;
}> {
  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `The following is a voice complaint in ${language} about a campus sanitation issue. 
Translate to English if needed and classify it.
Transcript: "${transcript}"

Respond ONLY with JSON:
{
  "englishText": "translated/cleaned text in English",
  "category": "WASTE|SPILL|ODOR|GRAFFITI|BROKEN_FIXTURE|OTHER",
  "severity": "LOW|MEDIUM|HIGH|CRITICAL"
}`,
        },
      ],
      max_tokens: 200,
    });
    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch {
    return { englishText: transcript, category: 'OTHER', severity: 'LOW' };
  }
}

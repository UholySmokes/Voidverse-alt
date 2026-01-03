// AI SDK configuration using z-ai-web-dev-sdk
import ZAI from 'z-ai-web-dev-sdk';

// Get ZAI client instance (reads from .z-ai-config file)
export async function getZAIClient() {
  return await ZAI.create();
}

// Helper function for chat completion
export async function generateChatCompletion(messages: any[], options: any = {}) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.create({
    messages,
    thinking: { type: 'disabled' },
  });

  return response.choices[0]?.message?.content || '';
}

// Helper function for image generation
export async function generateImage(prompt: string, options: any = {}) {
  const zai = await ZAI.create();

  const response = await zai.images.generations.create({
    prompt,
    size: options.size || '1344x768',
  });

  const imageBase64 = response.data[0].base64;
  return `data:image/png;base64,${imageBase64}`;
}

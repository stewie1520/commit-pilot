import { googleAI } from "npm:@genkit-ai/googleai";
import { genkit } from "npm:genkit";
import { ollama } from 'npm:genkitx-ollama';
import { config, waitForConfig } from '../config/loader.ts';

let _ai: ReturnType<typeof genkit>;

export const initAI = async () => {
  await waitForConfig();
  _ai = genkit({
  promptDir: './prompts',
  model: config.model === 'google-genai' ? 'googleai/gemini-2.0-flash' : config.ollamaModel,
  plugins: [
    ...(config.model === 'google-genai' ? [googleAI({
      apiKey: config.googleGenaiApiKey,
    })] : []),

    ...(config.model === 'ollama' ? [ollama({
      serverAddress: config.ollamaUrl,
    })] : []),
  ]
  });
  return _ai;
};

export const getAI = async () => {
  if (!_ai) {
    await initAI();
  }

  return _ai;
};

// Initialize AI
initAI();

export interface BaseConfig {
  model: 'google-genai' | 'ollama'
}

export interface GoogleGenaiConfig extends BaseConfig {
  model: 'google-genai'
  googleGenaiApiKey: string
}

export interface OllamaConfig extends BaseConfig {
  model: 'ollama'
  ollamaUrl: string
  ollamaModel: string
}

export type Config = GoogleGenaiConfig | OllamaConfig

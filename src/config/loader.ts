import { ensureFile } from "jsr:@std/fs/ensure-file";
import inquirer from 'npm:inquirer';
import type { Config } from './interfaces.ts';

const isMac = Deno.build.os === 'darwin';
const isLinux = Deno.build.os === 'linux';

export const configPath = (isMac || isLinux) ? `${Deno.env.get('HOME')}/.config/commit-pilot/config.json` : `${Deno.env.get('APPDATA')}\commit-pilot\config.json`

export let config: Config

const loadConfig = async () => {
  await ensureFile(configPath)

  const buffer = await Deno.readFile(configPath)
  const raw = new TextDecoder().decode(buffer) || '{}'
  const _config = await parseModel(JSON.parse(raw) as Record<string, unknown>)

  if (_config.model === 'google-genai') {
    if (!_config.googleGenaiApiKey) {
      const { googleGenaiApiKey } = await inquirer.prompt([
        {
          type: 'input',
          name: 'googleGenaiApiKey',
          message: 'Enter Google GenAI API key',
        }
      ])

      _config.googleGenaiApiKey = googleGenaiApiKey
    }
  }

  if (_config.model === 'ollama') {
    if (!_config.ollamaUrl || !_config.ollamaModel) {
      const { ollamaUrl, ollamaModel } = await inquirer.prompt([
        {
          type: 'input',
          name: 'ollamaUrl',
          message: 'Enter Ollama URL',
          default: 'http://127.0.0.1:11434'
        },
        {
          type: 'input',
          name: 'ollamaModel',
          message: 'Enter Ollama model',
          default: 'llama3.1'
        }
      ])

      _config.ollamaUrl = ollamaUrl
      _config.ollamaModel = ollamaModel
    }
  }

  await Deno.writeTextFile(configPath, JSON.stringify(_config, null, 2))
  
  config = _config
  return _config
}

const configLoadedPromise = loadConfig()
export const waitForConfig = () => configLoadedPromise

const parseModel = async (config: Record<string, unknown>): Promise<Config> => {
  if (!config.model) {
    const { model } = await inquirer.prompt([
      {
        type: 'list',
        name: 'model',
        message: 'Select AI model',
        choices: ['google-genai', 'ollama'],
      }
    ])

    config.model = model
  }

  return config as unknown as Config
}

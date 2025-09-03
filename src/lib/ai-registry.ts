// Comprehensive AI Model Registry
export interface AIModel {
  id: string
  name: string
  provider: string
  type: 'text' | 'image' | 'embedding' | 'multimodal' | 'code' | 'audio'
  category: 'proprietary' | 'open-source' | 'local'
  description: string
  maxTokens?: number
  supportsStreaming?: boolean
  supportsFunctions?: boolean
  costPer1kTokens?: {
    input: number
    output: number
  }
  endpoint?: string
  apiKeyRequired?: boolean
  features: string[]
}

export const AI_MODELS: AIModel[] = [
  // Proprietary Models
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    type: 'text',
    category: 'proprietary',
    description: 'Most capable GPT-4 model',
    maxTokens: 8192,
    supportsStreaming: true,
    supportsFunctions: true,
    costPer1kTokens: { input: 0.03, output: 0.06 },
    apiKeyRequired: true,
    features: ['reasoning', 'coding', 'creative writing', 'analysis']
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    type: 'text',
    category: 'proprietary',
    description: 'Latest GPT-4 model with knowledge up to April 2024',
    maxTokens: 128000,
    supportsStreaming: true,
    supportsFunctions: true,
    apiKeyRequired: true,
    features: ['reasoning', 'coding', 'creative writing', 'analysis', 'large-context']
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    type: 'text',
    category: 'proprietary',
    description: 'Fast and capable model for most tasks',
    maxTokens: 4096,
    supportsStreaming: true,
    supportsFunctions: true,
    costPer1kTokens: { input: 0.0015, output: 0.002 },
    apiKeyRequired: true,
    features: ['chat', 'coding', 'quick-tasks']
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    type: 'text',
    category: 'proprietary',
    description: 'Most intelligent Claude model',
    maxTokens: 200000,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'analysis', 'coding', 'creative-writing']
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    type: 'text',
    category: 'proprietary',
    description: 'Balance of intelligence and speed',
    maxTokens: 200000,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'coding', 'analysis']
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    type: 'text',
    category: 'proprietary',
    description: 'Fastest and most compact model',
    maxTokens: 200000,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'quick-tasks']
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    type: 'text',
    category: 'proprietary',
    description: 'Multimodal model with reasoning capabilities',
    maxTokens: 32768,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'multimodal', 'coding', 'analysis']
  },
  {
    id: 'gemini-ultra',
    name: 'Gemini Ultra',
    provider: 'Google',
    type: 'text',
    category: 'proprietary',
    description: 'Most capable Gemini model',
    maxTokens: 32768,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'multimodal', 'coding', 'analysis', 'complex-tasks']
  },

  // Open Source Models (HuggingFace)
  {
    id: 'llama-2-7b',
    name: 'Llama 2 7B',
    provider: 'Meta',
    type: 'text',
    category: 'open-source',
    description: '7 billion parameter Llama 2 model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
    apiKeyRequired: false,
    features: ['chat', 'reasoning', 'coding']
  },
  {
    id: 'llama-2-13b',
    name: 'Llama 2 13B',
    provider: 'Meta',
    type: 'text',
    category: 'open-source',
    description: '13 billion parameter Llama 2 model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-13b-chat-hf',
    apiKeyRequired: false,
    features: ['chat', 'reasoning', 'coding', 'analysis']
  },
  {
    id: 'llama-2-70b',
    name: 'Llama 2 70B',
    provider: 'Meta',
    type: 'text',
    category: 'open-source',
    description: '70 billion parameter Llama 2 model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf',
    apiKeyRequired: false,
    features: ['chat', 'reasoning', 'coding', 'analysis', 'complex-tasks']
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    provider: 'Mistral AI',
    type: 'text',
    category: 'open-source',
    description: '7 billion parameter Mistral model',
    maxTokens: 8192,
    endpoint: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
    apiKeyRequired: false,
    features: ['chat', 'reasoning', 'coding', 'multilingual']
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'Mistral AI',
    type: 'text',
    category: 'open-source',
    description: 'Mixture of experts model with 8x7 billion parameters',
    maxTokens: 32768,
    endpoint: 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
    apiKeyRequired: false,
    features: ['chat', 'reasoning', 'coding', 'multilingual', 'analysis']
  },
  {
    id: 'qwen-72b',
    name: 'Qwen 72B',
    provider: 'Alibaba',
    type: 'text',
    category: 'open-source',
    description: '72 billion parameter Qwen model',
    maxTokens: 32768,
    endpoint: 'https://api-inference.huggingface.co/models/Qwen/Qwen-72B-Chat',
    apiKeyRequired: false,
    features: ['chat', 'reasoning', 'coding', 'multilingual', 'chinese-specialized']
  },
  {
    id: 'falcon-40b',
    name: 'Falcon 40B',
    provider: 'TII',
    type: 'text',
    category: 'open-source',
    description: '40 billion parameter Falcon model',
    maxTokens: 2048,
    endpoint: 'https://api-inference.huggingface.co/models/tiiuae/falcon-40b-instruct',
    apiKeyRequired: false,
    features: ['chat', 'reasoning', 'coding']
  },
  {
    id: 'bloom-176b',
    name: 'BLOOM 176B',
    provider: 'BigScience',
    type: 'text',
    category: 'open-source',
    description: '176 billion parameter BLOOM model',
    maxTokens: 2048,
    endpoint: 'https://api-inference.huggingface.co/models/bigscience/bloom',
    apiKeyRequired: false,
    features: ['chat', 'reasoning', 'multilingual']
  },

  // Local Models (Ollama)
  {
    id: 'ollama-llama2',
    name: 'Ollama Llama 2',
    provider: 'Ollama',
    type: 'text',
    category: 'local',
    description: 'Local Llama 2 model via Ollama',
    maxTokens: 4096,
    endpoint: 'http://localhost:11434/api/generate',
    apiKeyRequired: false,
    features: ['chat', 'reasoning', 'coding', 'private']
  },
  {
    id: 'ollama-mistral',
    name: 'Ollama Mistral',
    provider: 'Ollama',
    type: 'text',
    category: 'local',
    description: 'Local Mistral model via Ollama',
    maxTokens: 8192,
    endpoint: 'http://localhost:11434/api/generate',
    apiKeyRequired: false,
    features: ['chat', 'reasoning', 'coding', 'private', 'fast']
  },
  {
    id: 'ollama-codellama',
    name: 'Ollama Code Llama',
    provider: 'Ollama',
    type: 'code',
    category: 'local',
    description: 'Local Code Llama model via Ollama',
    maxTokens: 4096,
    endpoint: 'http://localhost:11434/api/generate',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'debugging', 'private']
  },

  // Image Generation Models
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    type: 'image',
    category: 'proprietary',
    description: 'Advanced image generation model',
    apiKeyRequired: true,
    features: ['image-generation', 'high-quality', 'text-to-image']
  },
  {
    id: 'stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
    type: 'image',
    category: 'open-source',
    description: 'Open source image generation model',
    endpoint: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    apiKeyRequired: false,
    features: ['image-generation', 'high-quality', 'text-to-image', 'open-source']
  },
  {
    id: 'kandinsky-2.2',
    name: 'Kandinsky 2.2',
    provider: 'Kandinsky',
    type: 'image',
    category: 'open-source',
    description: 'Advanced image generation model',
    endpoint: 'https://api-inference.huggingface.co/models/kandinsky-community/kandinsky-2-2-decoder',
    apiKeyRequired: false,
    features: ['image-generation', 'artistic', 'text-to-image']
  },

  // Embedding Models
  {
    id: 'text-embedding-ada-002',
    name: 'Text Embedding Ada 002',
    provider: 'OpenAI',
    type: 'embedding',
    category: 'proprietary',
    description: 'OpenAI text embedding model',
    apiKeyRequired: true,
    features: ['embedding', 'semantic-search', 'similarity']
  },
  {
    id: 'sentence-transformers-all-MiniLM-L6-v2',
    name: 'Sentence Transformers MiniLM',
    provider: 'HuggingFace',
    type: 'embedding',
    category: 'open-source',
    description: 'Lightweight sentence embedding model',
    endpoint: 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
    apiKeyRequired: false,
    features: ['embedding', 'semantic-search', 'similarity', 'lightweight']
  },

  // Code Models
  {
    id: 'code-llama-7b',
    name: 'Code Llama 7B',
    provider: 'Meta',
    type: 'code',
    category: 'open-source',
    description: '7 billion parameter code generation model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-hf',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'debugging', 'multiple-languages']
  },
  {
    id: 'code-llama-34b',
    name: 'Code Llama 34B',
    provider: 'Meta',
    type: 'code',
    category: 'open-source',
    description: '34 billion parameter code generation model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/codellama/CodeLlama-34b-hf',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'debugging', 'multiple-languages', 'complex-code']
  },
  {
    id: 'starcoder',
    name: 'StarCoder',
    provider: 'HuggingFace',
    type: 'code',
    category: 'open-source',
    description: 'Open source code generation model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/bigcode/starcoder',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'multiple-languages', 'open-source']
  },

  // Chinese AI Models - Baidu
  {
    id: 'ernie-bot-4',
    name: 'ERNIE Bot 4',
    provider: 'Baidu',
    type: 'text',
    category: 'proprietary',
    description: 'Latest ERNIE model with advanced reasoning capabilities',
    maxTokens: 4096,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'multilingual', 'analysis']
  },
  {
    id: 'ernie-bot-turbo',
    name: 'ERNIE Bot Turbo',
    provider: 'Baidu',
    type: 'text',
    category: 'proprietary',
    description: 'Fast and efficient ERNIE model',
    maxTokens: 2048,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'quick-tasks']
  },
  {
    id: 'ernie-bot-3.5',
    name: 'ERNIE Bot 3.5',
    provider: 'Baidu',
    type: 'text',
    category: 'proprietary',
    description: 'Balanced performance ERNIE model',
    maxTokens: 4096,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'reasoning']
  },
  {
    id: 'ernie-speed',
    name: 'ERNIE Speed',
    provider: 'Baidu',
    type: 'text',
    category: 'proprietary',
    description: 'High-speed ERNIE model for real-time applications',
    maxTokens: 2048,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'real-time']
  },
  {
    id: 'ernie-lite',
    name: 'ERNIE Lite',
    provider: 'Baidu',
    type: 'text',
    category: 'proprietary',
    description: 'Lightweight ERNIE model for mobile applications',
    maxTokens: 1024,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'lightweight']
  },
  {
    id: 'ernie-character',
    name: 'ERNIE Character',
    provider: 'Baidu',
    type: 'text',
    category: 'proprietary',
    description: 'Character-based ERNIE model for creative writing',
    maxTokens: 2048,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['creative-writing', 'chinese-specialized', 'character-generation']
  },
  {
    id: 'ernie-code',
    name: 'ERNIE Code',
    provider: 'Baidu',
    type: 'code',
    category: 'proprietary',
    description: 'Code generation model with Chinese language support',
    maxTokens: 4096,
    apiKeyRequired: true,
    features: ['coding', 'code-generation', 'chinese-specialized', 'multiple-languages']
  },
  {
    id: 'ernie-image',
    name: 'ERNIE Image',
    provider: 'Baidu',
    type: 'image',
    category: 'proprietary',
    description: 'Image generation model with Chinese cultural elements',
    apiKeyRequired: true,
    features: ['image-generation', 'chinese-specialized', 'text-to-image']
  },

  // Chinese AI Models - Alibaba (Qianwen)
  {
    id: 'qwen-turbo',
    name: 'Qwen Turbo',
    provider: 'Alibaba',
    type: 'text',
    category: 'proprietary',
    description: 'Fast and efficient Qwen model',
    maxTokens: 8192,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'quick-tasks']
  },
  {
    id: 'qwen-plus',
    name: 'Qwen Plus',
    provider: 'Alibaba',
    type: 'text',
    category: 'proprietary',
    description: 'Enhanced Qwen model with better reasoning',
    maxTokens: 32768,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'analysis']
  },
  {
    id: 'qwen-max',
    name: 'Qwen Max',
    provider: 'Alibaba',
    type: 'text',
    category: 'proprietary',
    description: 'Most capable Qwen model',
    maxTokens: 32768,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'complex-tasks', 'analysis']
  },
  {
    id: 'qwen-vl-plus',
    name: 'Qwen VL Plus',
    provider: 'Alibaba',
    type: 'multimodal',
    category: 'proprietary',
    description: 'Vision-language model with Chinese support',
    maxTokens: 8192,
    apiKeyRequired: true,
    features: ['multimodal', 'chinese-specialized', 'image-understanding', 'visual-reasoning']
  },
  {
    id: 'qwen-vl-max',
    name: 'Qwen VL Max',
    provider: 'Alibaba',
    type: 'multimodal',
    category: 'proprietary',
    description: 'Advanced vision-language model',
    maxTokens: 32768,
    apiKeyRequired: true,
    features: ['multimodal', 'chinese-specialized', 'complex-visual-tasks', 'image-analysis']
  },
  {
    id: 'qwen-audio-turbo',
    name: 'Qwen Audio Turbo',
    provider: 'Alibaba',
    type: 'audio',
    category: 'proprietary',
    description: 'Fast audio processing model',
    maxTokens: 4096,
    apiKeyRequired: true,
    features: ['audio-processing', 'chinese-specialized', 'speech-recognition']
  },

  // Chinese AI Models - Tencent
  {
    id: 'hunyuan-pro',
    name: 'Hunyuan Pro',
    provider: 'Tencent',
    type: 'text',
    category: 'proprietary',
    description: 'Professional grade Hunyuan model',
    maxTokens: 32768,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'complex-tasks', 'analysis']
  },
  {
    id: 'hunyuan-standard',
    name: 'Hunyuan Standard',
    provider: 'Tencent',
    type: 'text',
    category: 'proprietary',
    description: 'Standard Hunyuan model',
    maxTokens: 16384,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'reasoning']
  },
  {
    id: 'hunyuan-lite',
    name: 'Hunyuan Lite',
    provider: 'Tencent',
    type: 'text',
    category: 'proprietary',
    description: 'Lightweight Hunyuan model',
    maxTokens: 8192,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'quick-tasks']
  },
  {
    id: 'hunyuan-vision',
    name: 'Hunyuan Vision',
    provider: 'Tencent',
    type: 'multimodal',
    category: 'proprietary',
    description: 'Vision-language model from Tencent',
    maxTokens: 16384,
    apiKeyRequired: true,
    features: ['multimodal', 'chinese-specialized', 'image-understanding', 'visual-reasoning']
  },

  // Chinese AI Models - Zhipu AI
  {
    id: 'glm-4',
    name: 'GLM-4',
    provider: 'Zhipu AI',
    type: 'text',
    category: 'proprietary',
    description: 'Latest GLM model with advanced capabilities',
    maxTokens: 32768,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'complex-tasks', 'analysis']
  },
  {
    id: 'glm-4-air',
    name: 'GLM-4 Air',
    provider: 'Zhipu AI',
    type: 'text',
    category: 'proprietary',
    description: 'Lightweight GLM-4 model',
    maxTokens: 16384,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'quick-tasks']
  },
  {
    id: 'glm-4-airx',
    name: 'GLM-4 AirX',
    provider: 'Zhipu AI',
    type: 'text',
    category: 'proprietary',
    description: 'Enhanced lightweight GLM-4 model',
    maxTokens: 16384,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'reasoning', 'analysis']
  },
  {
    id: 'glm-4-long',
    name: 'GLM-4 Long',
    provider: 'Zhipu AI',
    type: 'text',
    category: 'proprietary',
    description: 'Long context GLM-4 model',
    maxTokens: 128000,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'long-context', 'document-analysis']
  },
  {
    id: 'glm-4v',
    name: 'GLM-4V',
    provider: 'Zhipu AI',
    type: 'multimodal',
    category: 'proprietary',
    description: 'Vision-language GLM model',
    maxTokens: 8192,
    apiKeyRequired: true,
    features: ['multimodal', 'chinese-specialized', 'image-understanding', 'visual-reasoning']
  },
  {
    id: 'glm-3-turbo',
    name: 'GLM-3 Turbo',
    provider: 'Zhipu AI',
    type: 'text',
    category: 'proprietary',
    description: 'Fast GLM-3 model',
    maxTokens: 8192,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'quick-tasks']
  },

  // Chinese AI Models - MiniMax
  {
    id: 'minimax-abab6.5',
    name: 'MiniMax ABAB6.5',
    provider: 'MiniMax',
    type: 'text',
    category: 'proprietary',
    description: 'Advanced ABAB6.5 model',
    maxTokens: 16384,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'complex-tasks', 'analysis']
  },
  {
    id: 'minimax-abab6.5s',
    name: 'MiniMax ABAB6.5s',
    provider: 'MiniMax',
    type: 'text',
    category: 'proprietary',
    description: 'Fast ABAB6.5 model',
    maxTokens: 8192,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'quick-tasks']
  },
  {
    id: 'minimax-abab5.5',
    name: 'MiniMax ABAB5.5',
    provider: 'MiniMax',
    type: 'text',
    category: 'proprietary',
    description: 'Standard ABAB5.5 model',
    maxTokens: 8192,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'reasoning']
  },

  // Chinese AI Models - SenseTime
  {
    id: 'sensechat-pro',
    name: 'SenseChat Pro',
    provider: 'SenseTime',
    type: 'text',
    category: 'proprietary',
    description: 'Professional SenseChat model',
    maxTokens: 32768,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'complex-tasks', 'analysis']
  },
  {
    id: 'sensechat-standard',
    name: 'SenseChat Standard',
    provider: 'SenseTime',
    type: 'text',
    category: 'proprietary',
    description: 'Standard SenseChat model',
    maxTokens: 16384,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'reasoning']
  },
  {
    id: 'sensechat-lite',
    name: 'SenseChat Lite',
    provider: 'SenseTime',
    type: 'text',
    category: 'proprietary',
    description: 'Lightweight SenseChat model',
    maxTokens: 8192,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'quick-tasks']
  },

  // Chinese AI Models - DeepSeek
  {
    id: 'deepseek-v2',
    name: 'DeepSeek V2',
    provider: 'DeepSeek',
    type: 'text',
    category: 'proprietary',
    description: 'Latest DeepSeek model with MoE architecture',
    maxTokens: 32768,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'coding', 'chinese-specialized', 'complex-tasks']
  },
  {
    id: 'deepseek-v2.5',
    name: 'DeepSeek V2.5',
    provider: 'DeepSeek',
    type: 'text',
    category: 'proprietary',
    description: 'Enhanced DeepSeek V2 model',
    maxTokens: 32768,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'coding', 'chinese-specialized', 'analysis']
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'DeepSeek',
    type: 'code',
    category: 'proprietary',
    description: 'Specialized code generation model',
    maxTokens: 16384,
    apiKeyRequired: true,
    features: ['coding', 'code-generation', 'chinese-specialized', 'multiple-languages']
  },

  // Chinese AI Models - Moonshot (Kimi)
  {
    id: 'moonshot-v1-8k',
    name: 'Moonshot V1 8K',
    provider: 'Moonshot',
    type: 'text',
    category: 'proprietary',
    description: 'Moonshot model with 8K context',
    maxTokens: 8192,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'reasoning', 'long-context']
  },
  {
    id: 'moonshot-v1-32k',
    name: 'Moonshot V1 32K',
    provider: 'Moonshot',
    type: 'text',
    category: 'proprietary',
    description: 'Moonshot model with 32K context',
    maxTokens: 32768,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'long-context', 'document-analysis']
  },
  {
    id: 'moonshot-v1-128k',
    name: 'Moonshot V1 128K',
    provider: 'Moonshot',
    type: 'text',
    category: 'proprietary',
    description: 'Moonshot model with 128K context',
    maxTokens: 131072,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'very-long-context', 'document-analysis']
  },

  // Chinese AI Models - 01.AI (Yi)
  {
    id: 'yi-34b-chat',
    name: 'Yi 34B Chat',
    provider: '01.AI',
    type: 'text',
    category: 'proprietary',
    description: '34B parameter Yi model for chat',
    maxTokens: 4096,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['chat', 'chinese-specialized', 'reasoning', 'analysis']
  },
  {
    id: 'yi-98b-chat',
    name: 'Yi 98B Chat',
    provider: '01.AI',
    type: 'text',
    category: 'proprietary',
    description: '98B parameter Yi model for chat',
    maxTokens: 4096,
    supportsStreaming: true,
    apiKeyRequired: true,
    features: ['reasoning', 'chinese-specialized', 'complex-tasks', 'analysis']
  },
  {
    id: 'yi-vision',
    name: 'Yi Vision',
    provider: '01.AI',
    type: 'multimodal',
    category: 'proprietary',
    description: 'Multimodal Yi model',
    maxTokens: 4096,
    apiKeyRequired: true,
    features: ['multimodal', 'chinese-specialized', 'image-understanding', 'visual-reasoning']
  },

  // Chinese Open Source Models
  {
    id: 'yi-34b',
    name: 'Yi 34B',
    provider: '01.AI',
    type: 'text',
    category: 'open-source',
    description: 'Open source 34B parameter Yi model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/01-ai/Yi-34B',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'qwen1.5-72b',
    name: 'Qwen1.5 72B',
    provider: 'Alibaba',
    type: 'text',
    category: 'open-source',
    description: 'Open source 72B parameter Qwen model',
    maxTokens: 32768,
    endpoint: 'https://api-inference.huggingface.co/models/Qwen/Qwen1.5-72B',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'qwen1.5-32b',
    name: 'Qwen1.5 32B',
    provider: 'Alibaba',
    type: 'text',
    category: 'open-source',
    description: 'Open source 32B parameter Qwen model',
    maxTokens: 32768,
    endpoint: 'https://api-inference.huggingface.co/models/Qwen/Qwen1.5-32B',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'qwen1.5-14b',
    name: 'Qwen1.5 14B',
    provider: 'Alibaba',
    type: 'text',
    category: 'open-source',
    description: 'Open source 14B parameter Qwen model',
    maxTokens: 32768,
    endpoint: 'https://api-inference.huggingface.co/models/Qwen/Qwen1.5-14B',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'qwen1.5-7b',
    name: 'Qwen1.5 7B',
    provider: 'Alibaba',
    type: 'text',
    category: 'open-source',
    description: 'Open source 7B parameter Qwen model',
    maxTokens: 32768,
    endpoint: 'https://api-inference.huggingface.co/models/Qwen/Qwen1.5-7B',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'deepseek-vl-7b',
    name: 'DeepSeek VL 7B',
    provider: 'DeepSeek',
    type: 'multimodal',
    category: 'open-source',
    description: 'Open source 7B parameter multimodal model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-vl-7b-chat',
    apiKeyRequired: false,
    features: ['multimodal', 'chinese-specialized', 'image-understanding', 'open-source']
  },
  {
    id: 'internlm2-20b',
    name: 'InternLM2 20B',
    provider: 'Shanghai AI Lab',
    type: 'text',
    category: 'open-source',
    description: 'Open source 20B parameter InternLM2 model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/internlm/internlm2-20b',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'internlm2-7b',
    name: 'InternLM2 7B',
    provider: 'Shanghai AI Lab',
    type: 'text',
    category: 'open-source',
    description: 'Open source 7B parameter InternLM2 model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/internlm/internlm2-7b',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'chatglm3-6b',
    name: 'ChatGLM3 6B',
    provider: 'Zhipu AI',
    type: 'text',
    category: 'open-source',
    description: 'Open source 6B parameter ChatGLM3 model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/THUDM/chatglm3-6b',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'baichuan2-13b',
    name: 'Baichuan2 13B',
    provider: 'Baichuan AI',
    type: 'text',
    category: 'open-source',
    description: 'Open source 13B parameter Baichuan2 model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/baichuan-inc/Baichuan2-13B-Chat',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'baichuan2-7b',
    name: 'Baichuan2 7B',
    provider: 'Baichuan AI',
    type: 'text',
    category: 'open-source',
    description: 'Open source 7B parameter Baichuan2 model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/baichuan-inc/Baichuan2-7B-Chat',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'xverse-13b',
    name: 'XVERSE 13B',
    provider: 'XVERSE',
    type: 'text',
    category: 'open-source',
    description: 'Open source 13B parameter XVERSE model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/xverse/XVERSE-13B',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'xverse-7b',
    name: 'XVERSE 7B',
    provider: 'XVERSE',
    type: 'text',
    category: 'open-source',
    description: 'Open source 7B parameter XVERSE model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/xverse/XVERSE-7B',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'skywork-13b',
    name: 'Skywork 13B',
    provider: 'Skywork AI',
    type: 'text',
    category: 'open-source',
    description: 'Open source 13B parameter Skywork model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/skywork/Skywork-13B',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'telechat-12b',
    name: 'TeleChat 12B',
    provider: 'TeleAI',
    type: 'text',
    category: 'open-source',
    description: 'Open source 12B parameter TeleChat model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/Tele-AI/TeleChat-12B',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },
  {
    id: 'telechat-7b',
    name: 'TeleChat 7B',
    provider: 'TeleAI',
    type: 'text',
    category: 'open-source',
    description: 'Open source 7B parameter TeleChat model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/Tele-AI/TeleChat-7B',
    apiKeyRequired: false,
    features: ['chat', 'chinese-specialized', 'reasoning', 'open-source']
  },

  // Chinese Image Generation Models
  {
    id: 'taiyi-stable-diffusion-xl',
    name: 'Taiyi Stable Diffusion XL',
    provider: 'Taiyi AI',
    type: 'image',
    category: 'open-source',
    description: 'Chinese-themed Stable Diffusion XL model',
    endpoint: 'https://api-inference.huggingface.co/models/IDEA-CCNL/Taiyi-Stable-Diffusion-XL',
    apiKeyRequired: false,
    features: ['image-generation', 'chinese-specialized', 'text-to-image', 'open-source']
  },
  {
    id: 'kolors-stable-diffusion',
    name: 'Kolors Stable Diffusion',
    provider: 'Kolors',
    type: 'image',
    category: 'open-source',
    description: 'Chinese-style Stable Diffusion model',
    endpoint: 'https://api-inference.huggingface.co/models/Kwai-Kolors/Kolors',
    apiKeyRequired: false,
    features: ['image-generation', 'chinese-specialized', 'text-to-image', 'open-source']
  },
  {
    id: 'pangu-stable-diffusion',
    name: 'Pangu Stable Diffusion',
    provider: 'Pangu',
    type: 'image',
    category: 'open-source',
    description: 'Chinese cultural Stable Diffusion model',
    endpoint: 'https://api-inference.huggingface.co/models/THUDM/Pangu-Stable-Diffusion',
    apiKeyRequired: false,
    features: ['image-generation', 'chinese-specialized', 'text-to-image', 'open-source']
  },

  // Chinese Embedding Models
  {
    id: 'bge-large-zh',
    name: 'BGE Large Chinese',
    provider: 'BAAI',
    type: 'embedding',
    category: 'open-source',
    description: 'Large Chinese embedding model',
    endpoint: 'https://api-inference.huggingface.co/models/BAAI/bge-large-zh',
    apiKeyRequired: false,
    features: ['embedding', 'chinese-specialized', 'semantic-search', 'open-source']
  },
  {
    id: 'bge-base-zh',
    name: 'BGE Base Chinese',
    provider: 'BAAI',
    type: 'embedding',
    category: 'open-source',
    description: 'Base Chinese embedding model',
    endpoint: 'https://api-inference.huggingface.co/models/BAAI/bge-base-zh',
    apiKeyRequired: false,
    features: ['embedding', 'chinese-specialized', 'semantic-search', 'open-source']
  },
  {
    id: 'bge-small-zh',
    name: 'BGE Small Chinese',
    provider: 'BAAI',
    type: 'embedding',
    category: 'open-source',
    description: 'Small Chinese embedding model',
    endpoint: 'https://api-inference.huggingface.co/models/BAAI/bge-small-zh',
    apiKeyRequired: false,
    features: ['embedding', 'chinese-specialized', 'semantic-search', 'lightweight', 'open-source']
  },
  {
    id: 'text2vec-large-chinese',
    name: 'Text2Vec Large Chinese',
    provider: 'Text2Vec',
    type: 'embedding',
    category: 'open-source',
    description: 'Large Chinese text embedding model',
    endpoint: 'https://api-inference.huggingface.co/models/shibing624/text2vec-large-chinese',
    apiKeyRequired: false,
    features: ['embedding', 'chinese-specialized', 'semantic-search', 'open-source']
  },
  {
    id: 'text2vec-base-chinese',
    name: 'Text2Vec Base Chinese',
    provider: 'Text2Vec',
    type: 'embedding',
    category: 'open-source',
    description: 'Base Chinese text embedding model',
    endpoint: 'https://api-inference.huggingface.co/models/shibing624/text2vec-base-chinese',
    apiKeyRequired: false,
    features: ['embedding', 'chinese-specialized', 'semantic-search', 'open-source']
  },
  {
    id: 'text2vec-base-multilingual',
    name: 'Text2Vec Base Multilingual',
    provider: 'Text2Vec',
    type: 'embedding',
    category: 'open-source',
    description: 'Multilingual text embedding model',
    endpoint: 'https://api-inference.huggingface.co/models/shibing624/text2vec-base-multilingual',
    apiKeyRequired: false,
    features: ['embedding', 'multilingual', 'semantic-search', 'open-source']
  },

  // Chinese Code Models
  {
    id: 'codefuse-codellama-34b',
    name: 'CodeFuse CodeLlama 34B',
    provider: 'CodeFuse',
    type: 'code',
    category: 'open-source',
    description: 'Chinese-enhanced CodeLlama model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/CodeFuse-Dev/CodeFuse-Codellama-34B',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'chinese-specialized', 'multiple-languages', 'open-source']
  },
  {
    id: 'codefuse-codellama-13b',
    name: 'CodeFuse CodeLlama 13B',
    provider: 'CodeFuse',
    type: 'code',
    category: 'open-source',
    description: 'Chinese-enhanced CodeLlama 13B model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/CodeFuse-Dev/CodeFuse-Codellama-13B',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'chinese-specialized', 'multiple-languages', 'open-source']
  },
  {
    id: 'codefuse-codellama-7b',
    name: 'CodeFuse CodeLlama 7B',
    provider: 'CodeFuse',
    type: 'code',
    category: 'open-source',
    description: 'Chinese-enhanced CodeLlama 7B model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/CodeFuse-Dev/CodeFuse-Codellama-7B',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'chinese-specialized', 'multiple-languages', 'open-source']
  },
  {
    id: 'deepseek-coder-33b',
    name: 'DeepSeek Coder 33B',
    provider: 'DeepSeek',
    type: 'code',
    category: 'open-source',
    description: 'Open source 33B parameter code model',
    maxTokens: 16384,
    endpoint: 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-33b-instruct',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'chinese-specialized', 'multiple-languages', 'open-source']
  },
  {
    id: 'deepseek-coder-6.7b',
    name: 'DeepSeek Coder 6.7B',
    provider: 'DeepSeek',
    type: 'code',
    category: 'open-source',
    description: 'Open source 6.7B parameter code model',
    maxTokens: 16384,
    endpoint: 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-6.7b-instruct',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'chinese-specialized', 'multiple-languages', 'open-source']
  },
  {
    id: 'deepseek-coder-1.3b',
    name: 'DeepSeek Coder 1.3B',
    provider: 'DeepSeek',
    type: 'code',
    category: 'open-source',
    description: 'Open source 1.3B parameter code model',
    maxTokens: 16384,
    endpoint: 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-1.3b-instruct',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'chinese-specialized', 'multiple-languages', 'lightweight', 'open-source']
  },
  {
    id: 'wizardcoder-33b',
    name: 'WizardCoder 33B',
    provider: 'WizardLM',
    type: 'code',
    category: 'open-source',
    description: 'Open source 33B parameter code model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/WizardLM/WizardCoder-33B-V1.1',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'multiple-languages', 'open-source']
  },
  {
    id: 'wizardcoder-15b',
    name: 'WizardCoder 15B',
    provider: 'WizardLM',
    type: 'code',
    category: 'open-source',
    description: 'Open source 15B parameter code model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/WizardLM/WizardCoder-15B-V1.0',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'multiple-languages', 'open-source']
  },
  {
    id: 'wizardcoder-7b',
    name: 'WizardCoder 7B',
    provider: 'WizardLM',
    type: 'code',
    category: 'open-source',
    description: 'Open source 7B parameter code model',
    maxTokens: 4096,
    endpoint: 'https://api-inference.huggingface.co/models/WizardLM/WizardCoder-Python-7B-V1.0',
    apiKeyRequired: false,
    features: ['coding', 'code-generation', 'multiple-languages', 'open-source']
  }
]

export const getModelsByType = (type: AIModel['type']): AIModel[] => {
  return AI_MODELS.filter(model => model.type === type)
}

export const getModelsByProvider = (provider: string): AIModel[] => {
  return AI_MODELS.filter(model => model.provider.toLowerCase() === provider.toLowerCase())
}

export const getModelsByCategory = (category: AIModel['category']): AIModel[] => {
  return AI_MODELS.filter(model => model.category === category)
}

export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.id === id)
}

export const getAvailableModels = (): AIModel[] => {
  // Filter models based on available API keys and local setup
  return AI_MODELS.filter(model => {
    if (model.apiKeyRequired) {
      // Check if required API key is available
      switch (model.provider) {
        case 'OpenAI':
          return !!process.env.OPENAI_API_KEY
        case 'Anthropic':
          return !!process.env.ANTHROPIC_API_KEY
        case 'Google':
          return !!process.env.GOOGLE_AI_API_KEY
        default:
          return true
      }
    }
    return true
  })
}
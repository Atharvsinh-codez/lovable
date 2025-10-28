# OpenRouter Configuration Guide

## Overview

Your app is now configured to use **OpenRouter** instead of direct OpenAI API. OpenRouter provides access to 100+ AI models through a single API endpoint, giving you more flexibility and often better pricing.

---

## ✅ What's Configured

**Base URL:** `https://openrouter.ai/api/v1`

**Files Updated:**
- ✅ `app/api/generate-ai-code-stream/route.ts` - Main AI code generation
- ✅ `app/api/analyze-edit-intent/route.ts` - Edit intent analysis

**Environment Variable:**
- ✅ `OPENAI_API_KEY` - Your OpenRouter API key (already set in Replit Secrets)

---

## 🎯 Available Models

OpenRouter gives you access to many models. Here are the recommended ones:

### For Code Generation (Your Current Use Case):

| Model | ID | Best For | Cost |
|-------|-----|----------|------|
| **GPT-4 Turbo** | `openai/gpt-4-turbo` | Complex reasoning, best quality | $$ |
| **GPT-4o** | `openai/gpt-4o` | Balanced speed/quality | $$ |
| **Claude 3.5 Sonnet** | `anthropic/claude-3.5-sonnet` | Excellent at code, long context | $$ |
| **GPT-4o Mini** | `openai/gpt-4o-mini` | Fast, cheap, good quality | $ |
| **Llama 3.3 70B** | `meta-llama/llama-3.3-70b-instruct` | Open source, good quality | $ |
| **DeepSeek R1** | `deepseek/deepseek-r1` | Reasoning, math, logic | $ |

### For Artifact Creation (Recommended):

| Model | ID | Best For |
|-------|-----|----------|
| **Claude 3.5 Sonnet** | `anthropic/claude-3.5-sonnet` | Research synthesis, citations |
| **GPT-4o** | `openai/gpt-4o` | Fast persona creation |
| **GPT-4 Turbo** | `openai/gpt-4-turbo` | Complex journey maps |
| **Gemini Pro 1.5** | `google/gemini-pro-1.5` | Long documents, cheap |

---

## 🔧 How to Use Different Models

Your app already supports model selection! Users can choose models through the UI.

**Default Model:** `openai/gpt-oss-20b` (will use OpenRouter)

**To change the default:**

```typescript
// In app/api/generate-ai-code-stream/route.ts
const { prompt, model = 'anthropic/claude-3.5-sonnet', context } = await request.json();
```

---

## 💰 Pricing

OpenRouter uses **pay-as-you-go** pricing. Check current rates at: https://openrouter.ai/models

**Cost Optimization Tips:**
1. Use **GPT-4o Mini** for simple tasks (10x cheaper than GPT-4)
2. Use **Claude 3.5 Sonnet** for research synthesis (excellent quality/price)
3. Use **Llama 3.3 70B** for high-volume, lower-cost needs
4. Set spending limits in OpenRouter dashboard

---

## 🚀 Testing Your Setup

1. **Visit your app:** http://localhost:5000 (or your Replit URL)
2. **Try generating code** with a prompt
3. **Check the console logs** to verify OpenRouter is being used

**Expected log output:**
```
[generate-ai-code-stream] Using model: openai/gpt-4o-mini
[generate-ai-code-stream] Base URL: https://openrouter.ai/api/v1
```

---

## 🔄 Model Routing

OpenRouter automatically routes to the best available provider for each model:

- `openai/*` → OpenAI API
- `anthropic/*` → Anthropic API  
- `google/*` → Google AI
- `meta-llama/*` → Multiple providers (Groq, Together, etc.)

You don't need to manage different API keys—OpenRouter handles it all!

---

## 📊 Advanced Features

### 1. Model Fallbacks

OpenRouter can automatically fallback if a model is unavailable:

```typescript
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': 'https://yourdomain.com',
    'X-Title': 'Your App Name',
    // Enable fallbacks:
    'OpenRouter-Fallbacks': 'openai/gpt-4o-mini,anthropic/claude-3.5-sonnet'
  }
});
```

### 2. Usage Tracking

Track which models are being used:

```typescript
// OpenRouter returns usage info in response headers
// Check: x-openrouter-usage
```

### 3. Custom Prompts Per Model

Different models have different strengths:

```typescript
const getSystemPrompt = (model: string) => {
  if (model.includes('claude')) {
    return 'Claude-optimized prompt with XML tags...';
  }
  if (model.includes('gpt-4o')) {
    return 'GPT-4o optimized prompt with JSON...';
  }
  return 'Default prompt...';
};
```

---

## 🐛 Troubleshooting

### Error: "Invalid API Key"
- Check that `OPENAI_API_KEY` is set in Replit Secrets
- Get your key from: https://openrouter.ai/keys
- Make sure you have credits in your OpenRouter account

### Error: "Model not found"
- Check the model ID is correct: https://openrouter.ai/models
- Some models require special access (check OpenRouter docs)

### Slow Response Times
- Switch to faster models: `openai/gpt-4o-mini` or `anthropic/claude-3-haiku`
- Check OpenRouter status: https://status.openrouter.ai

### High Costs
- Monitor usage: https://openrouter.ai/activity
- Set spending limits in dashboard
- Use cheaper models for testing

---

## 🎓 Best Practices

### For Code Generation:
```typescript
// Use GPT-4o Mini for fast iterations
model: 'openai/gpt-4o-mini'

// Use Claude for complex refactoring
model: 'anthropic/claude-3.5-sonnet'
```

### For Artifact Creation:
```typescript
// Persona creation (needs good synthesis)
model: 'anthropic/claude-3.5-sonnet'

// Journey maps (needs structure)
model: 'openai/gpt-4o'

// Quick insights (speed matters)
model: 'openai/gpt-4o-mini'
```

---

## 📚 Resources

- **OpenRouter Docs:** https://openrouter.ai/docs
- **Model Comparison:** https://openrouter.ai/models
- **Pricing Calculator:** https://openrouter.ai/models
- **API Status:** https://status.openrouter.ai

---

## 🔐 Security Notes

- ✅ API keys stored in Replit Secrets (encrypted)
- ✅ Keys never exposed to client-side code
- ✅ OpenRouter doesn't train on your data (privacy-first)
- ✅ All requests over HTTPS

---

## Next Steps

1. **Test your setup** - Try generating some code
2. **Experiment with models** - Find the best one for your use case
3. **Monitor costs** - Check OpenRouter dashboard regularly
4. **Set limits** - Configure spending alerts

Your app now has access to 100+ AI models through a single API! 🎉

# LLM Integration Setup Guide

The Voidverse RPG now supports dynamic story generation using LLM APIs (OpenAI or Anthropic Claude).

## Quick Setup

1. **The environment file is auto-created:**
   
   When you run `start.sh` or `start.bat`, a `.env` file is automatically created from `.env.example` if it doesn't exist.
   
   Manual creation (optional):
   ```bash
   cp .env.example .env
   ```

2. **LLM is already enabled by default:**
   
   The `.env` file has `ENABLE_LLM=true` set by default. You can start using the system immediately, though without an API key it will use placeholder text.

3. **Add your API key for dynamic story generation:**

   ### Option A: OpenAI (GPT-4 recommended)
   ```bash
   OPENAI_API_KEY=your_openai_key_here
   OPENAI_MODEL=gpt-4
   ```

   ### Option B: Anthropic Claude (High quality)
   ```bash
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
   ```

   **Priority**: If multiple keys are present, the system uses: OpenAI > Anthropic

4. **Restart the backend:**
   ```bash
   cd backend
   npm start
   ```

## How It Works

When LLM is enabled:
- The system sends the game state and player choice to the LLM
- The LLM generates a narrative response following the Voidverse tone
- The LLM can propose state changes (new aspects, stat changes, experience)
- If LLM fails or is disabled, the system gracefully falls back to placeholder text

## Prompt System

The LLM integration uses three prompt files in `backend/llm/`:
- `systemPrompt.txt` - Defines the Voidverse System personality
- `rulesPrompt.txt` - Game rules and mechanics
- `storyPrompt.template.txt` - Template for each story generation request

## Cost Considerations

- **OpenAI GPT-4**: ~$0.03-0.06 per request (High quality)
- **OpenAI GPT-3.5-turbo**: ~$0.002 per request (Cheaper alternative)
- **Anthropic Claude**: ~$0.015-0.03 per request (Good balance)

## Troubleshooting

If the LLM isn't working:
1. Check that `ENABLE_LLM=true` in `.env`
2. Verify your API key is correct
3. Check backend console for error messages
4. The system will automatically fall back to placeholder text if there's an issue

## Disabling LLM

To disable LLM and use placeholder text:
```bash
ENABLE_LLM=false
```

This is useful for:
- Testing without API costs
- Development when you don't need dynamic story
- Avoiding API rate limits

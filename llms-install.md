# Installing brainstorm-mcp

## Quick install

```bash
claude mcp add brainstorm -- npx -y brainstorm-mcp
```

That alone is a complete, working install: hosted mode needs **zero API
keys** — it debates using whatever models are already available in the
calling environment (e.g. Claude Opus/Sonnet/Haiku sub-agents).

## Optional: bring external models into the debate

To add GPT, Gemini, DeepSeek, Groq or a local Ollama model as debate
participants, set the relevant key(s) as env vars on the server entry:

```json
{
  "mcpServers": {
    "brainstorm": {
      "command": "npx",
      "args": ["-y", "brainstorm-mcp"],
      "env": {
        "OPENAI_API_KEY": "sk-...",
        "GEMINI_API_KEY": "AIza...",
        "DEEPSEEK_API_KEY": "sk-..."
      }
    }
  }
}
```

None of these are required. Do not ask the user for API keys unless they
specifically want non-hosted models in the debate.

## Verifying the install

After adding the server, call the `brainstorm_quick` tool with any question.
A response within ~10 seconds confirms hosted mode is working end to end.

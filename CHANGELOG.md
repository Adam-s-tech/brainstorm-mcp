# Changelog

## 1.6.1

**Support for the latest models; fixes defaults that had stopped working.**

- **Default models updated:** `openai` → `gpt-6.1-sol`, `gemini` → `gemini-3.8-flash`,
  `deepseek` → `deepseek-flash`, `moonshot` → `kimi-k3`, `minimax` → `MiniMax-M3`,
  `glm` → `glm-5.3`, `qwen` → `qwen3.8-max`. `gemini-2.5-*` now returns 404 for new users, and
  DeepSeek no longer lists `deepseek-chat`/`deepseek-reasoner` (announced for retirement; they are
  still routed today but shouldn't be relied on). Moonshot's docs report Kimi K2.x as retired.
- **New `xai` provider** (Grok, `grok-4.7`) via `XAI_API_KEY`. `qwen` is now also detected from
  `DASHSCOPE_API_KEY`.
- **GPT-6 family** (`gpt-6-astra`, `gpt-6-sol`, `gpt-6.1-sol`, `gpt-6-luna`) gets
  `max_completion_tokens` and no `temperature`. Previously only `gpt-5*` and `o*` did, so GPT-6
  requests would have been sent `max_tokens` and rejected.
- **Thinking models** (Kimi K3, Gemini 3.x, DeepSeek V4, Grok 4+, GLM-5+, MiniMax M3+, Qwen 3.5+)
  are sent no `temperature` (provider default) and an 8192 output cap, since reasoning tokens count
  against it — Kimi K3 and GLM-5.3 return empty replies (`finish_reason: length`) under a small cap.
  Previously a 4096 cap could do the same; that failure now says the reasoning budget was
  likely exhausted.
- Inline `<think>…</think>` blocks (MiniMax, R1-style distills) are stripped from replies.
- `provider:default` now resolves to the provider's default model for API providers (it used to send
  the literal string `default`). Providers in a config file may omit `model` when a default is known.
- CLI failures now report the actual `ERROR:` lines instead of the tail of an echoed prompt.
- Cost estimates added for GPT-5.5, the GPT-6 family, DeepSeek V4, Qwen3.8 Max and Grok 4.7. Models
  without a published price (e.g. Gemini 3.x) still use the generic fallback.
- `gemini` and `qwen` CLI adapters no longer pin a model; the CLI picks its own default.

## 1.6.0

**CLI providers — debate on a subscription instead of API credits.**

A third transport alongside API and hosted mode. brainstorm can now shell out to agent CLIs
installed on your machine, so debates run on a plan you already pay for.

- Any supported CLI found on your `PATH` is registered automatically at startup — no configuration
  needed. Use it as `claude:sonnet`, `codex:default`, and so on.
- Built-in adapters: `claude` and `codex` (verified), plus `gemini`, `cursor-agent`, `opencode`,
  `qwen`, `kimi`, and `droid` (modelled on vendor docs — flags may need adjusting; `list_providers`
  and the startup log say which is which).
- `custom` adapter runs any other CLI from an argv template with `{{model}}`, `{{system}}`,
  `{{prompt}}`, and `{{outfile}}` placeholders.
- `backend` option points the Claude CLI at a vendor's Anthropic-compatible endpoint, so Moonshot
  (Kimi), MiniMax, and Z.ai (GLM) coding plans can join a debate. Tokens are read from the
  environment at call time and never stored in config.
- CLI calls run with tools disabled and a read-only sandbox where supported — they generate text,
  they don't touch your repo. Provider API-key env vars are stripped from the child process so the
  CLI falls back to subscription auth rather than billing credits.
- Cost estimates count CLI models as free: `~$0.0000 (2 of 3 via CLI subscriptions)`.

New env vars: `BRAINSTORM_CLI_PROVIDERS` (`auto` / `off` / adapter list), `BRAINSTORM_PREFER_CLI`,
`BRAINSTORM_CLI_TIMEOUT_MS`.

Also adds known base URLs and env-var detection for `moonshot`, `minimax`, `glm`, and `qwen` as
ordinary metered API providers.

`add_provider` accepts `kind: "cli"` with `adapter` / `backend` / `command` / `args`.
`list_providers` reports transport, verification status, and whether each CLI is on your PATH.

## 1.5.7

Raise the per-call timeout from 2 to 5 minutes — gpt-5.x reasoning models can run long on rich
prompts.

## 1.5.6

Drop `temperature` for gpt-5.x and o-series reasoning models, which reject any non-default value.

## 1.5.4 – 1.5.5

Add `mcpName` for the Official MCP Registry; packaging fixes.

## 1.5.3

Prepare for Anthropic MCP Directory submission.

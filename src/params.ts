/**
 * Per-model request shaping for OpenAI-compatible chat completions.
 *
 * Reasoning ("thinking") models differ from classic chat models in three ways
 * that matter here: some reject a non-default temperature, some require
 * max_completion_tokens instead of max_tokens, and all of them spend output
 * budget on chain-of-thought before the answer — so a cap that was generous
 * for a chat model can come back as an empty reply.
 */

/** OpenAI reasoning models (gpt-5.x, gpt-6.x, o-series). */
const OPENAI_REASONING = /^(gpt-[5-9]|o[0-9])/;

/**
 * Non-OpenAI models that think by default (or always). Vendors either fix
 * temperature (Kimi K3), ignore it (DeepSeek V4 thinking mode) or advise
 * against lowering it (Gemini 3), so we leave it at the provider default. The
 * big win is the token cap: reasoning counts against it, and Kimi K3 / GLM-5.3
 * return an empty reply when a small cap runs out mid-thought.
 */
const THINKING = new RegExp(
  "^(" +
    [
      "kimi-k3",
      "gemini-3",
      "deepseek-(flash|v4)",
      "glm-[5-9]",
      "minimax-m[3-9]",
      "qwen3\\.[5-9]",
      "grok-[4-9]",
    ].join("|") +
    ")",
  "i"
);

export type SamplingParams =
  | { max_completion_tokens: number }
  | { max_tokens: number; temperature?: number };

/** Sampling/length parameters to send for a given model id. */
export function samplingParamsFor(modelId: string): SamplingParams {
  if (OPENAI_REASONING.test(modelId)) return { max_completion_tokens: 8192 };
  if (THINKING.test(modelId)) return { max_tokens: 8192 };
  return { temperature: 0.7, max_tokens: 4096 };
}

/**
 * Remove <think>…</think> blocks some providers (MiniMax, DeepSeek-R1 style
 * distills on Ollama/Groq) leave inline in the answer. An unterminated block —
 * the output was cut off mid-thought — is dropped too, since it contains no
 * answer.
 */
export function stripThinkTags(content: string): string {
  return content
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*$/i, "")
    .trim();
}

// Reads content/demo.config.json (repo root). All demo content comes from there.
import raw from "../../../content/demo.config.json";

export type DemoConfig = typeof raw;
export const config: DemoConfig = raw;
export const CHILD_ID: string = raw.childId;

export type BrainProvider = "kimi" | "anthropic";

export function brainSettings() {
  const provider = raw.brain.provider as BrainProvider;
  const p = raw.brain.providers[provider] as {
    baseUrl?: string;
    model: string;
    keyEnv: string;
    thinking: string;
    effort?: string;
  };
  return { provider, ...p };
}

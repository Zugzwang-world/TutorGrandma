import { BOT_KEYS, BOTS, type BotKey } from "@/lib/types";
import { BotAvatar, ParentAvatar } from "./avatar";
import { CHAT_TITLE, toneOf } from "./ui";

function writingLine(working: BotKey[]): string {
  const names = working.map((b) => BOTS[b].name);
  if (names.length === 0) return "";
  if (names.length === 1) return `${names[0]} is writing…`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are writing…`;
  return "Everyone's reading…";
}

export function ChatHeader({ sender, working }: { sender: string | null; working: BotKey[] }) {
  const busy = writingLine(working);
  return (
    <header className="tg-safe-top sticky top-0 z-20 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[640px] items-center gap-3 px-4 py-2.5">
        <div className="relative flex shrink-0 -space-x-2.5" aria-label="Group members">
          <ParentAvatar name={sender} size={34} className="relative z-[6] ring-2 ring-cream" />
          {BOT_KEYS.map((k, i) => {
            const bot = BOTS[k];
            const on = working.includes(k);
            return (
              <span key={k} className="relative" style={{ zIndex: 5 - i }} title={on ? `${bot.name} is writing…` : bot.name}>
                <BotAvatar bot={bot} size={34} className="ring-2 ring-cream" />
                <span
                  className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full ring-2 ring-cream transition-[transform,opacity] duration-200 ${toneOf(bot).solid} ${
                    on ? "tg-writing scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </span>
            );
          })}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[19px] leading-tight font-extrabold tracking-tight">{CHAT_TITLE}</h1>
          <p className="truncate text-[13px] leading-snug text-muted" aria-live="polite">
            {busy ? <span className="font-semibold text-[#b86a00]">{busy}</span> : "Nani, Routine, House rules, Lessons, Memory & you"}
          </p>
        </div>
      </div>
    </header>
  );
}

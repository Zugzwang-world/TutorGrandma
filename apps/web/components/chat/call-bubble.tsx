import type { Message } from "@/lib/types";

// Placeholder call bubble. Task N2 replaces this file; keep the props as { message }.
export function CallBubble({ message }: { message: Message }) {
  void message;
  return (
    <div className="rounded-3xl rounded-tl-lg border border-line bg-paper px-4 py-3 shadow-[0_1px_0_rgba(43,33,24,0.04)]">
      <p className="text-base leading-snug font-bold">
        <span className="emoji mr-1">📞</span> Aarav wants to show you something!
      </p>
      <button
        type="button"
        disabled
        className="mt-2.5 w-full rounded-full bg-marigold/40 py-2 text-[15px] font-extrabold text-white"
      >
        Join
      </button>
    </div>
  );
}

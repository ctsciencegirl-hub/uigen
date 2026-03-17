"use client";

import { Loader2 } from "lucide-react";
import { getToolLabel } from "@/lib/tools/labels";

interface ToolCallIndicatorProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
}

export function ToolCallIndicator({ toolName, args, state }: ToolCallIndicatorProps) {
  const label = getToolLabel(toolName, args, state);
  const isPending = state === "call" || state === "partial-call";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isPending ? (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      ) : (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}

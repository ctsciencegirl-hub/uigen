"use client";

import { Loader2 } from "lucide-react";

export function getToolLabel(toolName: string, args: Record<string, unknown>): string {
  const path = typeof args.path === "string" ? args.path : "";
  const fileName = path.split("/").pop() || path;

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create": return `Creating ${fileName}`;
      case "str_replace":
      case "insert": return `Editing ${fileName}`;
      case "view": return `Reading ${fileName}`;
      case "undo_edit": return `Undoing edit to ${fileName}`;
    }
  }

  if (toolName === "file_manager") {
    if (args.command === "delete") return `Deleting ${fileName}`;
    if (args.command === "rename" && typeof args.new_path === "string") {
      return `Renaming ${fileName} to ${args.new_path.split("/").pop() || args.new_path}`;
    }
  }

  return toolName;
}

interface ToolCallIndicatorProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
}

export function ToolCallIndicator({ toolName, args, state }: ToolCallIndicatorProps) {
  const label = getToolLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {state === "result" ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}

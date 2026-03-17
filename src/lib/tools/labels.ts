type StrReplaceCommand = "view" | "create" | "str_replace" | "insert" | "undo_edit";

interface StrReplaceArgs {
  command?: StrReplaceCommand;
  path?: string;
}

interface FileManagerArgs {
  command?: "rename" | "delete";
  path?: string;
  new_path?: string;
}

type ToolCallState = "call" | "partial-call" | "result";

function fileName(path: string | undefined): string {
  if (!path) return "";
  return path.split("/").pop() || path;
}

function strReplaceLabel(args: StrReplaceArgs, state: ToolCallState): string {
  const file = fileName(args.path);
  const partial = state === "partial-call" || !file;

  switch (args.command) {
    case "create":     return partial ? "Creating..."          : `Creating ${file}`;
    case "str_replace":
    case "insert":     return partial ? "Editing..."           : `Editing ${file}`;
    case "view":       return partial ? "Reading..."           : `Reading ${file}`;
    case "undo_edit":  return partial ? "Undoing edit..."      : `Undoing edit to ${file}`;
    default:           return "Working...";
  }
}

function fileManagerLabel(args: FileManagerArgs, state: ToolCallState): string {
  const file = fileName(args.path);
  const partial = state === "partial-call" || !file;

  if (args.command === "delete") {
    return partial ? "Deleting..." : `Deleting ${file}`;
  }

  if (args.command === "rename") {
    if (partial) return "Renaming...";
    const newFile = fileName(args.new_path);
    return newFile ? `Renaming ${file} to ${newFile}` : `Renaming ${file}...`;
  }

  return "Working...";
}

/**
 * Returns a human-readable label for a tool call.
 * Handles `partial-call` gracefully — when args are still streaming in,
 * returns a verb-only label ("Creating...") rather than "Creating undefined".
 */
export function getToolLabel(
  toolName: string,
  args: Record<string, unknown>,
  state: ToolCallState = "call"
): string {
  if (toolName === "str_replace_editor") {
    return strReplaceLabel(args as StrReplaceArgs, state);
  }

  if (toolName === "file_manager") {
    return fileManagerLabel(args as FileManagerArgs, state);
  }

  return toolName;
}

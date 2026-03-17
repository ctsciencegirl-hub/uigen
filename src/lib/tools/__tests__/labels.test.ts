import { describe, it, expect } from "vitest";
import { getToolLabel } from "../labels";

describe("getToolLabel — str_replace_editor", () => {
  describe("complete args", () => {
    it("create", () => {
      expect(getToolLabel("str_replace_editor", { command: "create", path: "src/components/Button.tsx" }))
        .toBe("Creating Button.tsx");
    });

    it("str_replace", () => {
      expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "src/App.tsx" }))
        .toBe("Editing App.tsx");
    });

    it("insert maps to Editing", () => {
      expect(getToolLabel("str_replace_editor", { command: "insert", path: "src/App.tsx" }))
        .toBe("Editing App.tsx");
    });

    it("view", () => {
      expect(getToolLabel("str_replace_editor", { command: "view", path: "src/index.ts" }))
        .toBe("Reading index.ts");
    });

    it("undo_edit", () => {
      expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "src/App.tsx" }))
        .toBe("Undoing edit to App.tsx");
    });
  });

  describe("partial-call — args still streaming", () => {
    it("returns verb-only when path is missing", () => {
      expect(getToolLabel("str_replace_editor", { command: "create" }, "partial-call"))
        .toBe("Creating...");
    });

    it("returns Working... when command is missing", () => {
      expect(getToolLabel("str_replace_editor", {}, "partial-call"))
        .toBe("Working...");
    });

    it("returns verb-only even when path is present during partial-call", () => {
      expect(getToolLabel("str_replace_editor", { command: "create", path: "src/Foo.tsx" }, "partial-call"))
        .toBe("Creating...");
    });
  });
});

describe("getToolLabel — file_manager", () => {
  describe("complete args", () => {
    it("delete", () => {
      expect(getToolLabel("file_manager", { command: "delete", path: "src/old.tsx" }))
        .toBe("Deleting old.tsx");
    });

    it("rename with both paths", () => {
      expect(getToolLabel("file_manager", { command: "rename", path: "src/Foo.tsx", new_path: "src/Bar.tsx" }))
        .toBe("Renaming Foo.tsx to Bar.tsx");
    });

    it("rename without new_path", () => {
      expect(getToolLabel("file_manager", { command: "rename", path: "src/Foo.tsx" }))
        .toBe("Renaming Foo.tsx...");
    });
  });

  describe("partial-call", () => {
    it("delete without path", () => {
      expect(getToolLabel("file_manager", { command: "delete" }, "partial-call"))
        .toBe("Deleting...");
    });

    it("no command yet", () => {
      expect(getToolLabel("file_manager", {}, "partial-call"))
        .toBe("Working...");
    });
  });
});

describe("getToolLabel — edge cases", () => {
  it("falls back to toolName for unknown tool", () => {
    expect(getToolLabel("mystery_tool", {})).toBe("mystery_tool");
  });

  it("state defaults to call", () => {
    expect(getToolLabel("str_replace_editor", { command: "create", path: "src/A.tsx" }))
      .toBe("Creating A.tsx");
  });

  it("result state behaves same as call for complete args", () => {
    expect(getToolLabel("str_replace_editor", { command: "create", path: "src/A.tsx" }, "result"))
      .toBe("Creating A.tsx");
  });
});

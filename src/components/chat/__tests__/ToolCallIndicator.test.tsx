import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { getToolLabel, ToolCallIndicator } from "../ToolCallIndicator";

describe("getToolLabel", () => {
  describe("str_replace_editor", () => {
    it("create", () => {
      expect(getToolLabel("str_replace_editor", { command: "create", path: "src/components/Button.tsx" }))
        .toBe("Creating Button.tsx");
    });

    it("str_replace", () => {
      expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "src/App.tsx" }))
        .toBe("Editing App.tsx");
    });

    it("insert", () => {
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

  describe("file_manager", () => {
    it("delete", () => {
      expect(getToolLabel("file_manager", { command: "delete", path: "src/old.tsx" }))
        .toBe("Deleting old.tsx");
    });

    it("rename", () => {
      expect(getToolLabel("file_manager", { command: "rename", path: "src/Foo.tsx", new_path: "src/Bar.tsx" }))
        .toBe("Renaming Foo.tsx to Bar.tsx");
    });
  });

  it("falls back to toolName for unknown tools", () => {
    expect(getToolLabel("some_unknown_tool", {})).toBe("some_unknown_tool");
  });
});

describe("ToolCallIndicator", () => {
  it("shows spinner when pending", () => {
    const { container } = render(
      <ToolCallIndicator
        toolName="str_replace_editor"
        args={{ command: "create", path: "src/Button.tsx" }}
        state="call"
      />
    );
    expect(screen.getByText("Creating Button.tsx")).toBeDefined();
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("shows green dot when done", () => {
    const { container } = render(
      <ToolCallIndicator
        toolName="str_replace_editor"
        args={{ command: "str_replace", path: "src/App.tsx" }}
        state="result"
      />
    );
    expect(screen.getByText("Editing App.tsx")).toBeDefined();
    expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
    expect(container.querySelector(".animate-spin")).toBeNull();
  });
});

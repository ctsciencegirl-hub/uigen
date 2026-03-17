import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallIndicator } from "../ToolCallIndicator";

afterEach(() => {
  cleanup();
});

describe("ToolCallIndicator", () => {
  it("shows spinner for call state", () => {
    const { container } = render(
      <ToolCallIndicator
        toolName="str_replace_editor"
        args={{ command: "create", path: "src/Button.tsx" }}
        state="call"
      />
    );
    expect(screen.getByText("Creating Button.tsx")).toBeDefined();
    expect(container.querySelector(".animate-spin")).toBeTruthy();
    expect(container.querySelector(".bg-emerald-500")).toBeNull();
  });

  it("shows spinner for partial-call state", () => {
    const { container } = render(
      <ToolCallIndicator
        toolName="str_replace_editor"
        args={{ command: "create" }}
        state="partial-call"
      />
    );
    expect(screen.getByText("Creating...")).toBeDefined();
    expect(container.querySelector(".animate-spin")).toBeTruthy();
    expect(container.querySelector(".bg-emerald-500")).toBeNull();
  });

  it("shows Working... when no args have streamed yet", () => {
    const { container } = render(
      <ToolCallIndicator
        toolName="str_replace_editor"
        args={{}}
        state="partial-call"
      />
    );
    expect(screen.getByText("Working...")).toBeDefined();
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("shows green dot for result state", () => {
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

  it("renders fallback toolName for unknown tool", () => {
    render(
      <ToolCallIndicator
        toolName="mystery_tool"
        args={{}}
        state="call"
      />
    );
    expect(screen.getByText("mystery_tool")).toBeDefined();
  });
});

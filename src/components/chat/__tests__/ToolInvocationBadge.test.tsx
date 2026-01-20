import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("shows 'Created' message for str_replace_editor create command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "create", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Created App.jsx")).toBeDefined();
});

test("shows 'Creating' message for in-progress create command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "pending",
    args: { command: "create", path: "/components/Button.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Creating Button.jsx")).toBeDefined();
});

test("shows 'Edited' message for str_replace command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "str_replace", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Edited App.jsx")).toBeDefined();
});

test("shows 'Editing' message for in-progress str_replace command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "pending",
    args: { command: "str_replace", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Updated' message for insert command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "insert", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Updated App.jsx")).toBeDefined();
});

test("shows 'Viewed' message for view command", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result",
    result: "file contents",
    args: { command: "view", path: "/App.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Viewed App.jsx")).toBeDefined();
});

test("shows 'Renamed' message for file_manager rename command", () => {
  const tool = {
    toolName: "file_manager",
    state: "result",
    result: "Success",
    args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Renamed old.jsx to new.jsx")).toBeDefined();
});

test("shows 'Renaming' message for in-progress rename command", () => {
  const tool = {
    toolName: "file_manager",
    state: "pending",
    args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Renaming old.jsx to new.jsx")).toBeDefined();
});

test("shows 'Deleted' message for file_manager delete command", () => {
  const tool = {
    toolName: "file_manager",
    state: "result",
    result: "Success",
    args: { command: "delete", path: "/unused.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Deleted unused.jsx")).toBeDefined();
});

test("shows 'Deleting' message for in-progress delete command", () => {
  const tool = {
    toolName: "file_manager",
    state: "pending",
    args: { command: "delete", path: "/unused.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Deleting unused.jsx")).toBeDefined();
});

test("shows tool name for unknown tools", () => {
  const tool = {
    toolName: "unknown_tool",
    state: "result",
    result: "Success",
    args: {},
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("shows loading spinner for in-progress tools", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "pending",
    args: { command: "create", path: "/App.jsx" },
  };

  const { container } = render(<ToolInvocationBadge tool={tool} />);

  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("shows icon without spinner for completed tools", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "create", path: "/App.jsx" },
  };

  const { container } = render(<ToolInvocationBadge tool={tool} />);

  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeNull();
});

test("extracts filename from nested path", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
    args: { command: "create", path: "/components/ui/Button.jsx" },
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Created Button.jsx")).toBeDefined();
});

test("handles missing args gracefully", () => {
  const tool = {
    toolName: "str_replace_editor",
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationBadge tool={tool} />);

  expect(screen.getByText("Modified")).toBeDefined();
});

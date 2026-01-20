import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MainContent } from "../main-content";

// Mock the child components
vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface">Chat</div>,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame">Preview</div>,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree">File Tree</div>,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor">Code Editor</div>,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions">Header</div>,
}));

describe("MainContent Toggle Buttons", () => {
  it("should toggle between preview and code view when clicking the tabs", async () => {
    render(<MainContent />);

    // Initially should show preview
    expect(screen.getByTestId("preview-frame")).toBeInTheDocument();
    expect(screen.queryByTestId("file-tree")).not.toBeInTheDocument();
    expect(screen.queryByTestId("code-editor")).not.toBeInTheDocument();

    // Click on Code tab
    const codeTab = screen.getByRole("tab", { name: /code/i });
    fireEvent.click(codeTab);

    // Should now show code view (preview content should be hidden, code content should be visible)
    // Using queryByTestId because the elements still exist in DOM but are hidden with data-[state=inactive]:hidden
    const previewContent = screen.getByTestId("preview-frame").closest('[role="tabpanel"]');
    const codeContent = screen.getByTestId("file-tree").closest('[role="tabpanel"]');

    expect(previewContent).toHaveAttribute("data-state", "inactive");
    expect(codeContent).toHaveAttribute("data-state", "active");
    expect(screen.getByTestId("file-tree")).toBeInTheDocument();
    expect(screen.getByTestId("code-editor")).toBeInTheDocument();

    // Click on Preview tab
    const previewTab = screen.getByRole("tab", { name: /preview/i });
    fireEvent.click(previewTab);

    // Should show preview again
    expect(previewContent).toHaveAttribute("data-state", "active");
    expect(codeContent).toHaveAttribute("data-state", "inactive");
    expect(screen.getByTestId("preview-frame")).toBeInTheDocument();
  });

  it("should have the correct tab selected initially", () => {
    render(<MainContent />);

    const previewTab = screen.getByRole("tab", { name: /preview/i });
    const codeTab = screen.getByRole("tab", { name: /code/i });

    expect(previewTab).toHaveAttribute("data-state", "active");
    expect(codeTab).toHaveAttribute("data-state", "inactive");
  });
});

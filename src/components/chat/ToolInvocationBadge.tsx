"use client";

import { Loader2, FilePlus, FileEdit, Eye, Trash2, FolderEdit } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  state: string;
  result?: unknown;
  args?: Record<string, unknown>;
}

interface ToolInvocationBadgeProps {
  tool: ToolInvocation;
}

function getToolMessage(tool: ToolInvocation): { action: string; icon: React.ReactNode } {
  const { toolName, args } = tool;
  const path = (args?.path as string) || "";
  const filename = path.split("/").pop() || path;
  const isComplete = tool.state === "result" && tool.result;

  if (toolName === "str_replace_editor") {
    const command = args?.command as string;

    switch (command) {
      case "create":
        return {
          action: isComplete ? `Created ${filename}` : `Creating ${filename}`,
          icon: <FilePlus className="w-3 h-3" />,
        };
      case "str_replace":
        return {
          action: isComplete ? `Edited ${filename}` : `Editing ${filename}`,
          icon: <FileEdit className="w-3 h-3" />,
        };
      case "insert":
        return {
          action: isComplete ? `Updated ${filename}` : `Updating ${filename}`,
          icon: <FileEdit className="w-3 h-3" />,
        };
      case "view":
        return {
          action: isComplete ? `Viewed ${filename}` : `Viewing ${filename}`,
          icon: <Eye className="w-3 h-3" />,
        };
      default:
        return {
          action: isComplete ? `Modified ${filename}` : `Modifying ${filename}`,
          icon: <FileEdit className="w-3 h-3" />,
        };
    }
  }

  if (toolName === "file_manager") {
    const command = args?.command as string;
    const newPath = args?.new_path as string;
    const newFilename = newPath?.split("/").pop() || newPath;

    switch (command) {
      case "rename":
        return {
          action: isComplete
            ? `Renamed ${filename} to ${newFilename}`
            : `Renaming ${filename} to ${newFilename}`,
          icon: <FolderEdit className="w-3 h-3" />,
        };
      case "delete":
        return {
          action: isComplete ? `Deleted ${filename}` : `Deleting ${filename}`,
          icon: <Trash2 className="w-3 h-3" />,
        };
      default:
        return {
          action: isComplete ? `Modified ${filename}` : `Modifying ${filename}`,
          icon: <FileEdit className="w-3 h-3" />,
        };
    }
  }

  return {
    action: toolName,
    icon: <FileEdit className="w-3 h-3" />,
  };
}

export function ToolInvocationBadge({ tool }: ToolInvocationBadgeProps) {
  const isComplete = tool.state === "result" && tool.result;
  const { action, icon } = getToolMessage(tool);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <>
          <span className="text-emerald-600">{icon}</span>
          <span className="text-neutral-700">{action}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{action}</span>
        </>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Calendar, User } from "lucide-react";

type Task = {
  _id: string;
  title: string;
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId?: string;
  dueDate?: number;
};

const priorityConfig = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Med", className: "bg-blue-500/20 text-blue-400" },
  high: { label: "High", className: "bg-orange-500/20 text-orange-400" },
  urgent: { label: "Urgent", className: "bg-red-500/20 text-red-400" },
};

export function TaskCard({
  task,
  onClick,
}: {
  task: Task;
  onClick?: () => void;
}) {
  const priority = priorityConfig[task.priority];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent/50"
    >
      <p className="text-sm font-medium">{task.title}</p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium",
            priority.className
          )}
        >
          {priority.label}
        </span>
        {task.assigneeId && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <User className="size-3" />
          </span>
        )}
        {task.dueDate && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </button>
  );
}

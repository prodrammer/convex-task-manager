import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { ArrowLeft, Plus } from "lucide-react";

const STATUS_COLUMNS = [
  { key: "todo" as const, label: "To Do" },
  { key: "in_progress" as const, label: "In Progress" },
  { key: "in_review" as const, label: "In Review" },
  { key: "done" as const, label: "Done" },
  { key: "cancelled" as const, label: "Cancelled" },
];

export function ProjectDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id as Id<"projects">;
  const project = useQuery(api.projects.get, { id: projectId });
  const tasks = useQuery(api.tasks.listByProject, { projectId });
  const [showCreate, setShowCreate] = useState(false);

  if (project === undefined) {
    return <div className="p-6 text-muted-foreground">Loading…</div>;
  }

  if (project === null) {
    return <div className="p-6 text-muted-foreground">Project not found.</div>;
  }

  const tasksByStatus = STATUS_COLUMNS.map((col) => ({
    ...col,
    tasks: (tasks ?? []).filter((t) => t.status === col.key),
  }));

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate("/")}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full" style={{ backgroundColor: project.color }} />
          <h1 className="text-2xl font-bold">{project.name}</h1>
        </div>
        <div className="ml-auto">
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="size-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {tasksByStatus.map((col) => (
          <div key={col.key} className="min-w-[280px] flex-1">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-semibold text-muted-foreground">{col.label}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {col.tasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {col.tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <CreateTaskModal projectId={projectId} onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

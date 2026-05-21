import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { Plus, FolderKanban } from "lucide-react";

export function ProjectsScreen() {
  const projects = useQuery(api.projects.list);
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      {projects === undefined ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <FolderKanban className="size-12 text-muted-foreground" />
          <p className="text-muted-foreground">No projects yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <button
              key={project._id}
              type="button"
              onClick={() => navigate(`/projects/${project._id}`)}
              className="rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent/50"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ backgroundColor: project.color }} />
                <h2 className="font-semibold">{project.name}</h2>
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              )}
            </button>
          ))}
        </div>
      )}

      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

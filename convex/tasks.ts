import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("in_review"),
      v.literal("done"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    projectId: v.id("projects"),
    assigneeId: v.optional(v.id("users")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: args.status,
      priority: args.priority,
      projectId: args.projectId,
      assigneeId: args.assigneeId,
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("activityLog", {
      taskId,
      action: "created",
      createdAt: now,
    });
    return taskId;
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    assigneeId: v.optional(v.id("users")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Not found");
    const now = Date.now();
    const updates: Record<string, unknown> = { updatedAt: now };

    if (args.title !== undefined) {
      await ctx.db.insert("activityLog", {
        taskId: args.id,
        action: "updated",
        field: "title",
        oldValue: task.title,
        newValue: args.title,
        createdAt: now,
      });
      updates.title = args.title;
    }
    if (args.description !== undefined) updates.description = args.description;
    if (args.priority !== undefined) {
      await ctx.db.insert("activityLog", {
        taskId: args.id,
        action: "updated",
        field: "priority",
        oldValue: task.priority,
        newValue: args.priority,
        createdAt: now,
      });
      updates.priority = args.priority;
    }
    if (args.assigneeId !== undefined) {
      await ctx.db.insert("activityLog", {
        taskId: args.id,
        action: "assigned",
        field: "assigneeId",
        newValue: args.assigneeId,
        createdAt: now,
      });
      updates.assigneeId = args.assigneeId;
    }
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;

    await ctx.db.patch(args.id, updates);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("in_review"),
      v.literal("done"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Not found");
    const now = Date.now();
    await ctx.db.insert("activityLog", {
      taskId: args.id,
      action: "status_changed",
      field: "status",
      oldValue: task.status,
      newValue: args.status,
      createdAt: now,
    });
    await ctx.db.patch(args.id, { status: args.status, updatedAt: now });
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

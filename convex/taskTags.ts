import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listForTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const taskTags = await ctx.db
      .query("taskTags")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();
    const tags = await Promise.all(
      taskTags.map((tt) => ctx.db.get(tt.tagId))
    );
    return tags.filter(Boolean);
  },
});

export const addTag = mutation({
  args: {
    taskId: v.id("tasks"),
    tagId: v.id("tags"),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("taskTags")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();
    if (existing.some((tt) => tt.tagId === args.tagId)) return;
    return ctx.db.insert("taskTags", {
      taskId: args.taskId,
      tagId: args.tagId,
    });
  },
});

export const removeTag = mutation({
  args: {
    taskId: v.id("tasks"),
    tagId: v.id("tags"),
  },
  handler: async (ctx, args) => {
    const taskTags = await ctx.db
      .query("taskTags")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();
    const match = taskTags.find((tt) => tt.tagId === args.tagId);
    if (match) await ctx.db.delete(match._id);
  },
});

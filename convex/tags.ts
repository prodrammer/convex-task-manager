import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tags")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("tags", {
      name: args.name,
      color: args.color,
      projectId: args.projectId,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    const tag = await ctx.db.get(args.id);
    if (!tag) throw new Error("Not found");
    // Remove all taskTag associations
    const taskTags = await ctx.db
      .query("taskTags")
      .withIndex("by_tag", (q) => q.eq("tagId", args.id))
      .collect();
    for (const tt of taskTags) {
      await ctx.db.delete(tt._id);
    }
    await ctx.db.delete(args.id);
  },
});

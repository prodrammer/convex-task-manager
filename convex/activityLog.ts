import { v } from "convex/values";
import { query } from "./_generated/server";

export const listForTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("activityLog")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();
  },
});

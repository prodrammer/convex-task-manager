import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    ownerId: v.optional(v.id("users")),
    color: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  tasks: defineTable({
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
    createdBy: v.optional(v.id("users")),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_project_status", ["projectId", "status"])
    .index("by_assignee", ["assigneeId"]),

  tags: defineTable({
    name: v.string(),
    color: v.string(),
    projectId: v.id("projects"),
  }).index("by_project", ["projectId"]),

  taskTags: defineTable({
    taskId: v.id("tasks"),
    tagId: v.id("tags"),
  })
    .index("by_task", ["taskId"])
    .index("by_tag", ["tagId"]),

  comments: defineTable({
    taskId: v.id("tasks"),
    authorId: v.optional(v.id("users")),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_task", ["taskId"]),

  activityLog: defineTable({
    taskId: v.id("tasks"),
    userId: v.optional(v.id("users")),
    action: v.string(),
    field: v.optional(v.string()),
    oldValue: v.optional(v.string()),
    newValue: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_task", ["taskId"]),
});

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const taskSchema = z.object({
  assigneeId: z.string().optional(),
  campaignId: z.string().optional(),
  department: z.string().min(2),
  description: z.string().max(4000).optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  projectId: z.string().optional(),
  sprintId: z.string().optional(),
  title: z.string().min(2).max(180),
});

const campaignSchema = z.object({
  audience: z.string().min(2),
  budget: z.coerce.number().min(0),
  objective: z.string().min(2),
  ownerId: z.string(),
  title: z.string().min(2).max(180),
  type: z.enum(["DIGITAL", "OFFLINE", "BRAND", "PERFORMANCE", "WHATSAPP", "SMS", "EMAIL", "COLLEGE_VISIT", "B2B", "EVENT"]),
});

export async function createTask(input: z.infer<typeof taskSchema>) {
  const data = taskSchema.parse(input);
  const task = await prisma.task.create({
    data: {
      assigneeId: data.assigneeId,
      campaignId: data.campaignId,
      department: data.department,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      projectId: data.projectId,
      sprintId: data.sprintId,
      status: "TODO",
      title: data.title,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "task.created",
      entityId: task.id,
      entityType: "Task",
      message: `Created task ${task.title}`,
    },
  });

  revalidatePath("/");
  return task;
}

export async function createCampaign(input: z.infer<typeof campaignSchema>) {
  const data = campaignSchema.parse(input);
  const campaign = await prisma.campaign.create({
    data: {
      actualRoi: 0,
      audience: data.audience,
      budget: data.budget,
      expectedRoi: 0,
      objective: data.objective,
      ownerId: data.ownerId,
      spent: 0,
      status: "PLANNING",
      title: data.title,
      type: data.type,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "campaign.created",
      entityId: campaign.id,
      entityType: "Campaign",
      message: `Created campaign ${campaign.title}`,
    },
  });

  revalidatePath("/");
  return campaign;
}

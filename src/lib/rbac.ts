export const roles = [
  "Super Admin",
  "Marketing Director",
  "Marketing Manager",
  "Content Team",
  "Design Team",
  "Video Team",
  "Sales Team",
  "B2B Team",
  "Intern",
  "View Only",
] as const;

export type Role = (typeof roles)[number];

export const permissions = [
  "dashboard:read",
  "task:write",
  "project:write",
  "campaign:write",
  "budget:approve",
  "vendor:approve",
  "content:publish",
  "lead:own",
  "automation:run",
  "report:export",
  "settings:manage",
] as const;

export type Permission = (typeof permissions)[number];

const roleMatrix: Record<Role, Permission[]> = {
  "Super Admin": [...permissions],
  "Marketing Director": [
    "dashboard:read",
    "task:write",
    "project:write",
    "campaign:write",
    "budget:approve",
    "vendor:approve",
    "content:publish",
    "lead:own",
    "automation:run",
    "report:export",
  ],
  "Marketing Manager": [
    "dashboard:read",
    "task:write",
    "project:write",
    "campaign:write",
    "content:publish",
    "lead:own",
    "automation:run",
    "report:export",
  ],
  "Content Team": ["dashboard:read", "task:write", "content:publish", "report:export"],
  "Design Team": ["dashboard:read", "task:write", "project:write"],
  "Video Team": ["dashboard:read", "task:write", "project:write"],
  "Sales Team": ["dashboard:read", "task:write", "lead:own", "report:export"],
  "B2B Team": ["dashboard:read", "task:write", "campaign:write", "lead:own"],
  Intern: ["dashboard:read", "task:write"],
  "View Only": ["dashboard:read"],
};

export function can(role: Role, permission: Permission) {
  return roleMatrix[role].includes(permission);
}

export function permissionsFor(role: Role) {
  return roleMatrix[role];
}

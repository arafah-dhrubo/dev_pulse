export const ROLES = {
  ADMIN: "admin",
  CONTRIBUTOR: "contributor",
  USER: "user",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

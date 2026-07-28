import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid work email"),
});

export const acceptInviteSchema = z
  .object({
    token: z.string().min(1, "Invite token is required"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const workspacePolicySchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  retentionDays: z.number().min(30).max(365),
  audioStorageEnabled: z.boolean(),
  humanOverrideRequired: z.boolean(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  roleId: z.string().min(1, "Select a role"),
});

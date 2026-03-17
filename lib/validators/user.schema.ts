import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  profile_photo: z.string().optional(),
  location: z.string().max(100).optional(),
  interests: z.array(z.string()).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updatePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(6, "New password must be at least 6 characters"),
});

export const updateNotificationsSchema = z.object({
  course_updates: z.boolean().optional(),
  forum_mentions: z.boolean().optional(),
  live_classes: z.boolean().optional(),
});

import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  profile_photo: z.string().optional(),
  location: z.string().max(100).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

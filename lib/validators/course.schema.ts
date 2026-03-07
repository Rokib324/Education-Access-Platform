import { z } from "zod";

export const createCourseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").trim(),
    subject_id: z.string().min(1, "Subject is required"),
    grade_id: z.string().min(1, "Grade level is required"),
    description: z.string().optional().default(""),
    thumbnail: z.string().url("Invalid thumbnail URL").optional().or(z.literal("")),
    is_vocational: z.boolean().default(false),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

import { z } from "zod";

export const createLessonSchema = z.object({
    course_id: z.string().min(1, "Course ID is required"),
    title: z.string().min(2, "Title must be at least 2 characters").trim(),
    content_type: z.enum(["video", "pdf", "text", "audio", "interactive"]).default("text"),
    difficulty_level: z.enum(["easy", "medium", "hard"]).default("easy"),
    sequence_no: z.number().int().positive().default(1),
});

export const updateLessonSchema = createLessonSchema.partial().omit({ course_id: true });

export const progressSchema = z.object({
    completion_percentage: z.number().min(0).max(100),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type ProgressInput = z.infer<typeof progressSchema>;

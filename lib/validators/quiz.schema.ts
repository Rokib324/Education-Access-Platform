import { z } from "zod";

export const createQuizSchema = z.object({
    course_id: z.string().min(1, "Course ID is required"),
    lesson_id: z.string().optional(),
    title: z.string().min(2, "Title must be at least 2 characters").trim(),
    total_marks: z.number().positive().default(100),
    pass_mark: z.number().positive().default(50),
    time_limit_minutes: z.number().int().positive().optional(),
});

const answerSchema = z.object({
    question_id: z.string().min(1),
    selected_option_id: z.string().optional(),
    short_answer: z.string().optional(),
});

export const submitAttemptSchema = z.object({
    answers: z.array(answerSchema).min(1, "At least one answer is required"),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;

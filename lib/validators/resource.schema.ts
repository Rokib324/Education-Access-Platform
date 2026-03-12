import { z } from "zod";

export const createResourceSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters").trim(),
    description: z.string().optional().default(""),
    resource_type: z.enum(["pdf", "video", "audio", "link", "document", "image"]),
    file_url: z.string().min(1, "File URL is required").trim(),
    visibility: z.enum(["public", "private", "course-only"]).default("public"),
    subject_id: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;

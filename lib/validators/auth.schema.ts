import { z } from "zod";

export const registerSchema = z.object({
    full_name: z.string().min(2, "Full name must be at least 2 characters").trim(),
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["student", "teacher", "admin"]).default("student"),
    location: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

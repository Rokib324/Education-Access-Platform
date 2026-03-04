import connectDB from "../db/mongodb";
import Role from "../db/models/Role";

export const ROLES = {
    STUDENT: "student",
    TEACHER: "teacher",
    ADMIN: "admin",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

/**
 * Finds or creates a Role document by name.
 * Seeds the role into the DB on first use.
 */
export async function ensureRoleExists(roleName: RoleName) {
    await connectDB();
    let role = await Role.findOne({ role_name: roleName });
    if (!role) {
        role = await Role.create({ role_name: roleName });
    }
    return role;
}

/**
 * Seed all three roles at once (useful for initial setup).
 */
export async function seedAllRoles() {
    await connectDB();
    const roleNames: RoleName[] = [ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN];
    for (const name of roleNames) {
        await Role.findOneAndUpdate(
            { role_name: name },
            { role_name: name },
            { upsert: true, new: true }
        );
    }
}

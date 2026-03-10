import connectDB from "@/lib/db/mongodb";
import OfflineDownload from "@/lib/db/models/OfflineDownload";
import { Types } from "mongoose";

/**
 * Get all offline download records for a given user, populated with lesson + course details.
 */
export async function getUserDownloads(userId: string) {
    await connectDB();
    return OfflineDownload.find({ user_id: new Types.ObjectId(userId) })
        .populate({
            path: "lesson_id",
            select: "title content_type difficulty_level course_id",
            populate: {
                path: "course_id",
                select: "title subject_id grade_id",
                populate: [
                    { path: "subject_id", select: "subject_name" },
                    { path: "grade_id", select: "grade_name" },
                ],
            },
        })
        .sort({ downloaded_at: -1 })
        .lean();
}

/**
 * Add (or update) an offline download record for a user and lesson.
 * Idempotent — uses upsert so re-downloading is safe.
 */
export async function addDownload(userId: string, lessonId: string) {
    await connectDB();
    return OfflineDownload.findOneAndUpdate(
        {
            user_id: new Types.ObjectId(userId),
            lesson_id: new Types.ObjectId(lessonId),
        },
        {
            $set: {
                downloaded_at: new Date(),
                sync_status: "synced",
            },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
}

/**
 * Remove a download record by its database _id, scoped to the requesting user.
 */
export async function removeDownload(userId: string, downloadId: string) {
    await connectDB();
    const result = await OfflineDownload.findOneAndDelete({
        _id: new Types.ObjectId(downloadId),
        user_id: new Types.ObjectId(userId),
    });
    return result ? true : null;
}

/**
 * Check if a specific lesson is already downloaded by the user.
 */
export async function isLessonDownloaded(userId: string, lessonId: string): Promise<boolean> {
    await connectDB();
    const existing = await OfflineDownload.findOne({
        user_id: new Types.ObjectId(userId),
        lesson_id: new Types.ObjectId(lessonId),
    }).lean();
    return !!existing;
}

/**
 * Update the last_accessed_at field when a user opens a downloaded lesson.
 */
export async function touchDownload(userId: string, lessonId: string) {
    await connectDB();
    return OfflineDownload.findOneAndUpdate(
        {
            user_id: new Types.ObjectId(userId),
            lesson_id: new Types.ObjectId(lessonId),
        },
        { $set: { last_accessed_at: new Date() } },
        { new: true }
    ).lean();
}

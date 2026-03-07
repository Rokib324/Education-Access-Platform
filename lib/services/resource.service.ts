import connectDB from "@/lib/db/mongodb";
import Resource from "@/lib/db/models/Resource";
import { CreateResourceInput } from "@/lib/validators/resource.schema";
import { Types } from "mongoose";

export interface ResourceFilters {
    subject_id?: string;
    resource_type?: string;
    visibility?: string;
    created_by?: string;
}

export async function getResources(filters: ResourceFilters = {}) {
    await connectDB();
    const query: Record<string, unknown> = {};
    if (filters.subject_id) query.subject_id = new Types.ObjectId(filters.subject_id);
    if (filters.resource_type) query.resource_type = filters.resource_type;
    if (filters.visibility) query.visibility = filters.visibility;
    if (filters.created_by) query.created_by = new Types.ObjectId(filters.created_by);

    return Resource.find(query)
        .populate("created_by", "full_name email profile_photo")
        .populate("subject_id", "subject_name")
        .sort({ createdAt: -1 })
        .lean();
}

export async function getResourceById(id: string) {
    await connectDB();
    return Resource.findById(id)
        .populate("created_by", "full_name email")
        .populate("subject_id", "subject_name")
        .lean();
}

export async function createResource(data: CreateResourceInput, userId: string) {
    await connectDB();
    return Resource.create({
        ...data,
        created_by: new Types.ObjectId(userId),
        subject_id: data.subject_id ? new Types.ObjectId(data.subject_id) : undefined,
    });
}

export async function deleteResource(id: string, userId: string, isAdmin: boolean) {
    await connectDB();
    const resource = await Resource.findById(id);
    if (!resource) return null;
    if (!isAdmin && resource.created_by.toString() !== userId) {
        throw new Error("FORBIDDEN");
    }
    await resource.deleteOne();
    return true;
}

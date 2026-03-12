import connectDB from "@/lib/db/mongodb";
import Resource from "@/lib/db/models/Resource";
import ResourceTag from "@/lib/db/models/ResourceTag";
import ResourceTagMap from "@/lib/db/models/ResourceTagMap";
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

    return Resource.aggregate([
        { $match: query },
        {
            $lookup: {
                from: "users",
                localField: "created_by",
                foreignField: "_id",
                as: "creator"
            }
        },
        { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "subjects",
                localField: "subject_id",
                foreignField: "_id",
                as: "subject_obj"
            }
        },
        { $unwind: { path: "$subject_obj", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "resourcetagmaps",
                localField: "_id",
                foreignField: "resource_id",
                as: "tag_maps"
            }
        },
        {
            $lookup: {
                from: "resourcetags",
                localField: "tag_maps.tag_id",
                foreignField: "_id",
                as: "tags_docs"
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                resource_type: 1,
                file_url: 1,
                visibility: 1,
                subject_id: 1,
                subject_name: "$subject_obj.subject_name",
                createdAt: 1,
                updatedAt: 1,
                "created_by": "$creator.full_name",
                tags: {
                    $map: {
                        input: "$tags_docs",
                        as: "t",
                        in: "$$t.tag_name"
                    }
                }
            }
        },
        { $sort: { createdAt: -1 } }
    ]);
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
    const resource = await Resource.create({
        ...data,
        created_by: new Types.ObjectId(userId),
        subject_id: data.subject_id ? new Types.ObjectId(data.subject_id) : undefined,
    });

    if (data.tags && data.tags.length > 0) {
        const tagPromises = data.tags.map(async (tagName) => {
            const normalizedTag = tagName.trim().toLowerCase();
            let tag = await ResourceTag.findOne({ tag_name: normalizedTag });
            if (!tag) {
                try {
                    tag = await ResourceTag.create({ tag_name: normalizedTag });
                } catch (err: any) {
                    if (err.code === 11000) { // unique bounds concurrency fix
                        tag = await ResourceTag.findOne({ tag_name: normalizedTag });
                    } else {
                        throw err;
                    }
                }
            }
            if (tag) {
                await ResourceTagMap.findOneAndUpdate(
                    { resource_id: resource._id, tag_id: tag._id },
                    { resource_id: resource._id, tag_id: tag._id },
                    { upsert: true, new: true }
                );
            }
        });
        await Promise.all(tagPromises);
    }
    
    return resource;
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

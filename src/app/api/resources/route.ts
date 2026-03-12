import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getResources, createResource } from "@/lib/services/resource.service";
import { createResourceSchema } from "@/lib/validators/resource.schema";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filters = {
            subject_id: searchParams.get("subject_id") || undefined,
            resource_type: searchParams.get("resource_type") || undefined,
            visibility: searchParams.get("visibility") || undefined,
            created_by: searchParams.get("created_by") || undefined,
        };
        const resources = await getResources(filters);
        return NextResponse.json({ resources });
    } catch (err) {
        console.error("[RESOURCES GET]", err);
        return NextResponse.json({ error: "Failed to fetch resources." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (payload.roleName === "student") return NextResponse.json({ error: "Students are not allowed to upload resources." }, { status: 403 });

        const body = await req.json();
        const parsed = createResourceSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const resource = await createResource(parsed.data, payload.userId);
        return NextResponse.json({ message: "Resource created.", resource }, { status: 201 });
    } catch (err) {
        console.error("[RESOURCES POST]", err);
        return NextResponse.json({ error: "Failed to create resource." }, { status: 500 });
    }
}

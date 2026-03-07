import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getClassById, updateVirtualClass } from "@/lib/services/class.service";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const virtualClass = await getClassById(id);
        if (!virtualClass) return NextResponse.json({ error: "Virtual class not found." }, { status: 404 });
        return NextResponse.json({ virtualClass });
    } catch (err) {
        console.error("[VIRTUAL-CLASS GET]", err);
        return NextResponse.json({ error: "Failed to fetch virtual class." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const isAdmin = payload.roleName === "admin";
        const updated = await updateVirtualClass(id, body, payload.userId, isAdmin);
        if (!updated) return NextResponse.json({ error: "Virtual class not found." }, { status: 404 });
        return NextResponse.json({ message: "Virtual class updated.", virtualClass: updated });
    } catch (err: unknown) {
        if (err instanceof Error && err.message === "FORBIDDEN") {
            return NextResponse.json({ error: "Permission denied." }, { status: 403 });
        }
        console.error("[VIRTUAL-CLASS PUT]", err);
        return NextResponse.json({ error: "Failed to update virtual class." }, { status: 500 });
    }
}

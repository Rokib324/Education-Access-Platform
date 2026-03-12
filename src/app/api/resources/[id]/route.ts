import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { deleteResource } from "@/lib/services/resource.service";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
        if (payload.roleName === "student") return NextResponse.json({ error: "Students are not allowed to delete resources." }, { status: 403 });

        const { id } = await params;
        const isAdmin = payload.roleName === "admin";
        
        const success = await deleteResource(id, payload.userId, isAdmin);
        if (!success) {
            return NextResponse.json({ error: "Resource not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Resource deleted successfully" }, { status: 200 });
    } catch (err: any) {
        if (err.message === "FORBIDDEN") {
            return NextResponse.json({ error: "You do not have permission to delete this resource." }, { status: 403 });
        }
        console.error("[RESOURCES DELETE]", err);
        return NextResponse.json({ error: "Failed to delete resource." }, { status: 500 });
    }
}

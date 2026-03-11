import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { getClassMessages, sendClassMessage } from "@/lib/services/class.service";
import { z } from "zod";

const messageSchema = z.object({
    message_text: z.string().min(1, "Message cannot be empty").trim(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const messages = await getClassMessages(id);
        return NextResponse.json({ messages });
    } catch (err) {
        console.error("[CLASS-MESSAGES GET]", err);
        return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getTokenFromRequest(req);
        if (!payload) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

        const { id } = await params;
        const body = await req.json();
        
        const parsed = messageSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const message = await sendClassMessage(id, payload.userId, parsed.data.message_text);
        return NextResponse.json({ message: "Message sent.", data: message }, { status: 201 });
    } catch (err) {
        console.error("[CLASS-MESSAGES POST]", err);
        return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }
}

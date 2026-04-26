import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/lib/auth/sessions";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES: Record<string, string[]> = {
  video: ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo"],
  audio: ["audio/mpeg", "audio/mp3", "audio/ogg", "audio/wav", "audio/aac", "audio/flac", "audio/x-m4a"],
  image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/avif"],
  pdf:   ["application/pdf"],
  document: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ],
};

const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(req: NextRequest) {
  try {
    const payload = await getTokenFromRequest(req);
    if (!payload) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    if (payload.roleName === "student") {
      return NextResponse.json({ error: "Students are not allowed to upload resources." }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const resourceType = formData.get("resource_type") as string | null;

    if (!file || !resourceType) {
      return NextResponse.json({ error: "File and resource_type are required." }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: `File too large. Max size is ${MAX_SIZE_BYTES / 1024 / 1024}MB.` }, { status: 400 });
    }

    const allowedMimes = ALLOWED_TYPES[resourceType];
    if (!allowedMimes) {
      return NextResponse.json({ error: "Unknown resource type." }, { status: 400 });
    }

    // Be lenient with mime-type matching
    const fileMime = file.type || "";
    const isAllowed = allowedMimes.some((m) => fileMime.startsWith(m) || m.startsWith(fileMime.split("/")[0]));
    if (!isAllowed && fileMime !== "") {
      return NextResponse.json(
        { error: `File type "${fileMime}" is not allowed for resource type "${resourceType}".` },
        { status: 400 }
      );
    }

    const ext = getExtension(file.name, fileMime);
    const safeFileName = `${randomUUID()}${ext}`;

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(join(uploadDir, safeFileName), buffer);

    const publicUrl = `/uploads/${safeFileName}`;
    return NextResponse.json({ url: publicUrl, originalName: file.name, size: file.size }, { status: 200 });
  } catch (err) {
    console.error("[RESOURCE UPLOAD]", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}

function getExtension(filename: string, mime: string): string {
  const fromName = filename.includes(".") ? `.${filename.split(".").pop()!.toLowerCase()}` : "";
  if (fromName) return fromName;
  const mimeMap: Record<string, string> = {
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/ogg": ".ogg",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "text/plain": ".txt",
  };
  return mimeMap[mime] || ".bin";
}

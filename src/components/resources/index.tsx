"use client";

import { useState } from "react";
import {
  BiDownload,
  BiFile,
  BiGlobe,
  BiLink,
  BiLock,
  BiPlus,
  BiTag,
  BiVideo,
} from "react-icons/bi";

export type Resource = {
  _id: string;
  title: string;
  description?: string;
  resource_type: "pdf" | "video" | "link" | "document";
  visibility: "public" | "private";
  created_by: string;
  tags: string[];
  file_url?: string;
  link?: string;
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  pdf: <BiFile className="h-5 w-5 text-red-500" />,
  video: <BiVideo className="h-5 w-5 text-blue-500" />,
  link: <BiLink className="h-5 w-5 text-emerald-500" />,
  document: <BiFile className="h-5 w-5 text-zinc-500" />,
};

// ─── Resource Card ────────────────────────────────────────────────────────────
export const ResourceCard = ({ resource }: { resource: Resource }) => (
  <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-2">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-50 border border-zinc-100">
        {TYPE_ICONS[resource.resource_type]}
      </div>
      <span
        className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
          resource.visibility === "public"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-zinc-100 text-zinc-500"
        }`}
      >
        {resource.visibility === "public" ? (
          <BiGlobe className="h-3 w-3" />
        ) : (
          <BiLock className="h-3 w-3" />
        )}
        {resource.visibility}
      </span>
    </div>

    <div>
      <h3 className="text-sm font-semibold text-zinc-900">{resource.title}</h3>
      {resource.description && (
        <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">
          {resource.description}
        </p>
      )}
    </div>

    {/* Tags */}
    {resource.tags.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {resource.tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-0.5 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600"
          >
            <BiTag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>
    )}

    <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
      <span className="text-xs text-zinc-400">By {resource.created_by}</span>
      <a
        href={resource.file_url || resource.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
      >
        <BiDownload className="h-3.5 w-3.5" />
        {resource.resource_type === "link" ? "Open" : "Download"}
      </a>
    </div>
  </div>
);

// ─── Demo data ────────────────────────────────────────────────────────────────
const ALL_TAGS = ["Math", "English", "Science", "Business", "Agriculture", "Video", "PDF"];

const DEMO_RESOURCES: Resource[] = [
  {
    _id: "r1",
    title: "Math Grade 5 Workbook",
    description: "Printable worksheet covering fractions, geometry, and basic algebra.",
    resource_type: "pdf",
    visibility: "public",
    created_by: "Ms. Fatima",
    tags: ["Math", "PDF"],
  },
  {
    _id: "r2",
    title: "English Story Reading — Video",
    description: "Short story reading session perfect for Grade 3–5 learners.",
    resource_type: "video",
    visibility: "public",
    created_by: "Mr. Karim",
    tags: ["English", "Video"],
  },
  {
    _id: "r3",
    title: "How to Start a Small Business",
    description: "Step-by-step guide for young entrepreneurs in rural communities.",
    resource_type: "link",
    visibility: "public",
    created_by: "Dr. Amina",
    tags: ["Business"],
  },
  {
    _id: "r4",
    title: "Ecosystem Study Notes",
    description: "Teacher notes on climate, biomes, and environmental sustainability.",
    resource_type: "document",
    visibility: "private",
    created_by: "Mr. Hasan",
    tags: ["Science"],
  },
  {
    _id: "r5",
    title: "Irrigation Techniques Guide",
    description: "Low-cost irrigation methods for small farms.",
    resource_type: "pdf",
    visibility: "public",
    created_by: "Ms. Ranu",
    tags: ["Agriculture", "PDF"],
  },
];

// ─── Resource List ────────────────────────────────────────────────────────────
const ResourceList = () => {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [type, setType] = useState("");

  const filtered = DEMO_RESOURCES.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (selectedTag && !r.tags.includes(selectedTag)) return false;
    if (type && r.resource_type !== type) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Resources</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Shared lesson plans, guides, and materials
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors">
          <BiPlus className="h-4 w-4" />
          Upload Resource
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search resources…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 w-48"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="">All Types</option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="link">Link</option>
          <option value="document">Document</option>
        </select>
      </div>

      {/* Tag chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag("")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !selectedTag
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          All
        </button>
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedTag === tag
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16">
          <BiFile className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">No resources match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r._id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceList;

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BiDownload,
  BiFile,
  BiGlobe,
  BiLink,
  BiLock,
  BiPlus,
  BiTag,
  BiVideo,
  BiTrash,
} from "react-icons/bi";

export type Resource = {
  _id: string;
  title: string;
  description?: string;
  resource_type: "pdf" | "video" | "link" | "document" | "audio" | "image";
  visibility: "public" | "private" | "course-only";
  created_by: string; // The author name resolved via aggregation
  author_id?: string; // We don't have this explicitly returned right now, relies on session ID inside service for deletion. Let's just conditionally rely on the backend resolving ownership if role != student
  tags: string[];
  file_url: string;
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  pdf: <BiFile className="h-5 w-5 text-red-500" />,
  video: <BiVideo className="h-5 w-5 text-blue-500" />,
  link: <BiLink className="h-5 w-5 text-emerald-500" />,
  document: <BiFile className="h-5 w-5 text-zinc-500" />,
  audio: <BiFile className="h-5 w-5 text-purple-500" />,
  image: <BiFile className="h-5 w-5 text-orange-500" />,
};

// ─── Resource Card ────────────────────────────────────────────────────────────
export const ResourceCard = ({ 
  resource, 
  userRole, 
  onDelete 
}: { 
  resource: Resource; 
  userRole: string | null; 
  onDelete: (id: string) => void;
}) => (
  <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow relative group">
    {(userRole === "teacher" || userRole === "admin") && (
       <button
          onClick={() => onDelete(resource._id)}
          className="absolute top-4 right-4 p-1.5 rounded-md bg-zinc-100 text-zinc-500 hover:bg-red-50 hover:text-red-500 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Delete Resource"
       >
          <BiTrash className="w-4 h-4" />
       </button>
    )}

    <div className="flex items-start justify-between gap-2 pr-8">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-50 border border-zinc-100">
        {TYPE_ICONS[resource.resource_type] || <BiFile className="h-5 w-5 text-zinc-400" />}
      </div>
      <span
        className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
          resource.visibility === "public"
            ? "bg-emerald-100 text-emerald-700"
            : resource.visibility === "course-only"
            ? "bg-blue-100 text-blue-700"
            : "bg-zinc-100 text-zinc-500"
        }`}
      >
        {resource.visibility === "public" ? (
          <BiGlobe className="h-3 w-3" />
        ) : (
          <BiLock className="h-3 w-3" />
        )}
        {resource.visibility.replace("-", " ")}
      </span>
    </div>

    <div>
      <h3 className="text-sm font-semibold text-zinc-900 pr-4">{resource.title}</h3>
      {resource.description && (
        <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">
          {resource.description}
        </p>
      )}
    </div>

    {/* Tags */}
    {resource.tags && resource.tags.length > 0 && (
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

    <div className="flex items-center justify-between border-t border-zinc-100 pt-3 mt-auto">
      <span className="text-xs text-zinc-400">By {resource.created_by}</span>
      <a
        href={resource.file_url || "#"}
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

// ─── Resource List ────────────────────────────────────────────────────────────
const ResourceList = () => {
  const [sessionRole, setSessionRole] = useState<string | null>(null);
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    resource_type: "pdf" as Resource["resource_type"],
    visibility: "public" as Resource["visibility"],
    file_url: "",
    tagsInput: ""
  });
  const [uploadError, setUploadError] = useState("");

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setSessionRole(data.user?.role || "student");
      }
    } catch(err) {
      console.error(err);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch("/api/resources");
      if (res.ok) {
        const json = await res.json();
        setResources(json.resources || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
    fetchResources();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError("");

    const parsedTags = uploadData.tagsInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title: uploadData.title,
      description: uploadData.description,
      resource_type: uploadData.resource_type,
      visibility: uploadData.visibility,
      file_url: uploadData.file_url,
      tags: parsedTags
    };

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload resource");
      }
      setShowUpload(false);
      setUploadData({
        title: "", description: "", resource_type: "pdf", visibility: "public", file_url: "", tagsInput: ""
      });
      fetchResources();
    } catch (err: any) {
      setUploadError(err.message || "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
     if (!confirm("Are you sure you want to delete this resource?")) return;
     try {
       const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
       const data = await res.json();
       if (!res.ok) throw new Error(data.error || "Failed to delete resource");
       
       setResources(prev => prev.filter(r => r._id !== id));
     } catch(err: any) {
       alert(err.message || "Failed to delete resource.");
     }
  };

  // Dynamically calculate ALL_TAGS from the fetched resources array
  const ALL_TAGS = useMemo(() => {
    const tagSet = new Set<string>();
    resources.forEach(r => {
      r.tags?.forEach(t => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  }, [resources]);

  const filtered = resources.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedTag && (!r.tags || !r.tags.includes(selectedTag))) return false;
    if (typeFilter && r.resource_type !== typeFilter) return false;
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
        {(sessionRole === "teacher" || sessionRole === "admin") && (
           <button 
             onClick={() => setShowUpload(true)}
             className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
           >
             <BiPlus className="h-4 w-4" />
             Upload Resource
           </button>
        )}
      </div>

      {showUpload && (sessionRole === "teacher" || sessionRole === "admin") && (
        <form onSubmit={handleUpload} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-zinc-900">Upload a New Resource</h2>
          {uploadError && <p className="text-red-500 text-xs">{uploadError}</p>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Title <span className="text-red-500">*</span></label>
              <input required value={uploadData.title} onChange={e => setUploadData({ ...uploadData, title: e.target.value })} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">File URL / Link <span className="text-red-500">*</span></label>
              <input required value={uploadData.file_url} onChange={e => setUploadData({ ...uploadData, file_url: e.target.value })} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
             <label className="block text-xs font-medium text-zinc-500 mb-1">Description</label>
             <textarea value={uploadData.description} onChange={e => setUploadData({ ...uploadData, description: e.target.value })} rows={2} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Type</label>
                <select value={uploadData.resource_type} onChange={e => setUploadData({ ...uploadData, resource_type: e.target.value as any })} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm">
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="link">Link</option>
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Visibility</label>
                <select value={uploadData.visibility} onChange={e => setUploadData({ ...uploadData, visibility: e.target.value as any })} className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="course-only">Course Only</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Tags (comma separated)</label>
                <input value={uploadData.tagsInput} onChange={e => setUploadData({ ...uploadData, tagsInput: e.target.value })} placeholder="Math, Grade 5, Geometry" className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm" />
             </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={isUploading} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition">
              {isUploading ? "Uploading..." : "Save Resource"}
            </button>
            <button type="button" onClick={() => setShowUpload(false)} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50">
              Cancel
            </button>
          </div>
        </form>
      )}

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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >
          <option value="">All Types</option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="link">Link</option>
          <option value="document">Document</option>
          <option value="image">Image</option>
        </select>
      </div>

      {/* Tag chips */}
      {ALL_TAGS.length > 0 && (
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
              <span className="capitalize">{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin text-zinc-500 border-2 border-r-transparent border-zinc-500 rounded-full w-8 h-8"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16">
          <BiFile className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">No resources match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r._id} resource={r} userRole={sessionRole} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceList;

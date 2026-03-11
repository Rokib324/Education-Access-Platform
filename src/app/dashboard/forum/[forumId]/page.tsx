"use client";

import { useEffect, useState, use } from "react";
import { BiMessageDetail, BiArrowBack, BiPlus, BiUser, BiTime } from "react-icons/bi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type PostType = {
  _id: string;
  forum_id: string;
  title: string;
  content: string;
  author: string;
  comment_count: number;
  likes: number;
  created_at: string;
};

export const PostCard = ({ post, forumId }: { post: PostType, forumId: string }) => (
  <Link
    href={`/dashboard/forum/${forumId}/post/${post._id}`}
    className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
  >
    <h3 className="text-sm font-semibold text-zinc-900">{post.title}</h3>
    <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{post.content}</p>
    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
      <span className="flex items-center gap-1">
        <BiUser className="h-3.5 w-3.5" />
        {post.author}
      </span>
      <span className="flex items-center gap-1">
        <BiTime className="h-3.5 w-3.5" />
        {post.created_at}
      </span>
      <span className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-600 font-medium">
        <BiMessageDetail className="h-3.5 w-3.5" />
        {post.comment_count} comments
      </span>
    </div>
  </Link>
);

export default function ForumPage({ params }: { params: Promise<{ forumId: string }> }) {
  const { forumId } = use(params);
  const router = useRouter();
  
  const [data, setData] = useState<{ forum: any, posts: PostType[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({ title: "", content: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/forums/${forumId}/posts`);
      if (!res.ok) throw new Error("Forum not found");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [forumId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError("");

    try {
      const res = await fetch(`/api/forums/${forumId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData)
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create post");

      // Reset and redirect to the new post
      setCreateData({ title: "", content: "" });
      setShowCreate(false);
      router.push(`/dashboard/forum/${forumId}/post/${json.post._id}`);
    } catch (err: any) {
      setCreateError(err.message || "An error occurred.");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin text-zinc-500 border-2 border-r-transparent border-zinc-500 rounded-full w-8 h-8"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <p className="text-zinc-400 mb-4">{error || "Forum not found."}</p>
        <Link href="/dashboard/forum" className="text-blue-500 hover:underline">
          Return to Forums
        </Link>
      </div>
    );
  }

  const { forum, posts } = data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link href="/dashboard/forum" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-4">
          <BiArrowBack /> Back to forums
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{forum.title}</h1>
            {forum.description && <p className="text-sm text-zinc-500 mt-1">{forum.description}</p>}
          </div>
          <button 
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            <BiPlus className="h-4 w-4" />
            New Post
          </button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreatePost} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-zinc-900">Create a New Post</h2>
          {createError && <p className="text-red-500 text-xs">{createError}</p>}
          
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Title</label>
            <input
              required
              value={createData.title}
              onChange={e => setCreateData({ ...createData, title: e.target.value })}
              placeholder="e.g. Help with Chapter 4 Equations"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Content</label>
            <textarea
              required
              value={createData.content}
              onChange={e => setCreateData({ ...createData, content: e.target.value })}
              placeholder="Describe your question or discussion topic..."
              rows={4}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              type="submit"
              disabled={isCreating}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isCreating ? "Posting..." : "Post Discussion"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-lg border border-zinc-200 px-5 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16">
            <BiMessageDetail className="h-10 w-10 text-zinc-300" />
            <p className="mt-3 text-sm text-zinc-500">No posts yet. Be the first!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} forumId={forumId} />
          ))
        )}
      </div>
    </div>
  );
}
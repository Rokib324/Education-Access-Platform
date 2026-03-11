"use client";

import { useEffect, useState, use } from "react";
import { BiArrowBack, BiTime, BiUser } from "react-icons/bi";
import Link from "next/link";

export type CommentType = {
  _id: string;
  post_id: string;
  user: string;
  comment_text: string;
  created_at: string;
};

export const CommentItem = ({ comment }: { comment: CommentType }) => (
  <div className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-5 mt-3">
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-zinc-200 font-bold text-zinc-700 shadow-sm border border-zinc-300">
      {comment.user.charAt(0).toUpperCase()}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold text-zinc-900">{comment.user}</span>
        <span className="text-xs text-zinc-400 font-medium">• {comment.created_at}</span>
      </div>
      <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{comment.comment_text}</p>
    </div>
  </div>
);

export default function PostPage({ params }: { params: Promise<{ forumId: string, postId: string }> }) {
  const { forumId, postId } = use(params);
  
  const [data, setData] = useState<{ post: any, comments: CommentType[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/forums/posts/${postId}`);
      if (!res.ok) throw new Error("Post not found");
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
  }, [postId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/forums/posts/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_text: newComment })
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to post comment");

      // Optimistically append the new comment
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [...prev.comments, json.comment]
        };
      });
      
      setNewComment("");
    } catch (err: any) {
      alert(err.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
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
        <p className="text-zinc-400 mb-4">{error || "Post not found."}</p>
        <Link href={`/dashboard/forum/${forumId}`} className="text-blue-500 hover:underline">
          Return to Forum
        </Link>
      </div>
    );
  }

  const { post, comments } = data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <Link href={`/dashboard/forum/${forumId}`} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
        <BiArrowBack /> Back to posts
      </Link>

      {/* Main Post Thread */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="p-6">
          <h1 className="text-xl font-bold text-zinc-900">{post.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500 bg-zinc-50 w-fit px-3 py-1.5 rounded-lg border border-zinc-100">
            <span className="flex items-center gap-1 font-semibold text-zinc-700">
              <BiUser className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <BiTime className="h-4 w-4" />
              {post.created_at}
            </span>
          </div>
          <p className="mt-5 text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
        
        {/* Comments Section */}
        <div className="bg-zinc-50/50 border-t border-zinc-100 p-6">
          <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
            Discussions <span className="bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full text-xs">{comments.length}</span>
          </h3>
          
          <div className="space-y-4 mb-6">
            {comments.map((c) => (
              <CommentItem key={c._id} comment={c} />
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-zinc-500 italic py-4">No comments yet. Start the conversation!</p>
            )}
          </div>

          {/* Add comment textArea */}
          <div className="flex gap-3 mt-8">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700 shadow-sm border border-blue-200">
              Me
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment…"
                rows={3}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none shadow-sm transition"
              />
              <div className="flex justify-end">
                <button
                  onClick={handlePostComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  {isSubmitting ? "Posting..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

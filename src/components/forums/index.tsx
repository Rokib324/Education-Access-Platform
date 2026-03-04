"use client";

import { useState } from "react";
import {
  BiChat,
  BiChevronRight,
  BiLike,
  BiMessageDetail,
  BiPlus,
  BiTime,
  BiUser,
} from "react-icons/bi";

export type Forum = {
  _id: string;
  title: string;
  description?: string;
  post_count: number;
  created_by: string;
};

export type Post = {
  _id: string;
  forum_id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  comment_count: number;
  likes: number;
};

export type Comment = {
  _id: string;
  post_id: string;
  user: string;
  comment_text: string;
  created_at: string;
};

// ─── Forum Card ───────────────────────────────────────────────────────────────
export const ForumCard = ({
  forum,
  onClick,
}: {
  forum: Forum;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all"
  >
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-zinc-100">
      <BiChat className="h-6 w-6 text-zinc-600" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-semibold text-zinc-900">{forum.title}</h3>
      {forum.description && (
        <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
          {forum.description}
        </p>
      )}
      <span className="mt-1 inline-block text-xs text-zinc-400">
        {forum.post_count} posts · By {forum.created_by}
      </span>
    </div>
    <BiChevronRight className="h-5 w-5 shrink-0 text-zinc-400" />
  </button>
);

// ─── Post Card ────────────────────────────────────────────────────────────────
export const PostCard = ({
  post,
  onClick,
}: {
  post: Post;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
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
      <span className="flex items-center gap-1">
        <BiMessageDetail className="h-3.5 w-3.5" />
        {post.comment_count} comments
      </span>
      <span className="flex items-center gap-1">
        <BiLike className="h-3.5 w-3.5" />
        {post.likes}
      </span>
    </div>
  </div>
);

// ─── Comment Item ─────────────────────────────────────────────────────────────
export const CommentItem = ({ comment }: { comment: Comment }) => (
  <div className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-200 text-xs font-bold text-zinc-700">
      {comment.user.charAt(0).toUpperCase()}
    </div>
    <div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-800">{comment.user}</span>
        <span className="text-[11px] text-zinc-400">{comment.created_at}</span>
      </div>
      <p className="mt-0.5 text-sm text-zinc-700">{comment.comment_text}</p>
    </div>
  </div>
);

// ─── Demo data ────────────────────────────────────────────────────────────────
const DEMO_FORUMS: Forum[] = [
  {
    _id: "f1",
    title: "Mathematics Help & Discussion",
    description: "Ask questions and share solutions about math topics.",
    post_count: 24,
    created_by: "Ms. Fatima",
  },
  {
    _id: "f2",
    title: "English Language Corner",
    description: "Practice writing, reading, and get feedback from peers.",
    post_count: 18,
    created_by: "Mr. Karim",
  },
  {
    _id: "f3",
    title: "Entrepreneurship & Business Ideas",
    description: "Share and discuss business ideas, challenges, and successes.",
    post_count: 31,
    created_by: "Dr. Amina",
  },
  {
    _id: "f4",
    title: "General Community Board",
    description: "Announcements, introductions, and community chatter.",
    post_count: 56,
    created_by: "Admin",
  },
];

const DEMO_POSTS: Post[] = [
  {
    _id: "p1",
    forum_id: "f1",
    title: "How do I solve quadratic equations?",
    content: "I'm stuck on quadratic equations in Chapter 4. Can anyone explain the steps using the formula?",
    author: "Rakib",
    created_at: "Mar 3, 2026",
    comment_count: 5,
    likes: 12,
  },
  {
    _id: "p2",
    forum_id: "f1",
    title: "Fraction tips for Grade 5",
    content: "Here are some easy ways I found to remember fraction rules. Hope it helps!",
    author: "Sadia",
    created_at: "Mar 2, 2026",
    comment_count: 3,
    likes: 8,
  },
];

const DEMO_COMMENTS: Comment[] = [
  {
    _id: "c1",
    post_id: "p1",
    user: "Ms. Fatima",
    comment_text: "Use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a. Let me know if you need more examples!",
    created_at: "Mar 3, 2026",
  },
  {
    _id: "c2",
    post_id: "p1",
    user: "Imran",
    comment_text: "I watched the video on Lesson 3 and it explains it really well!",
    created_at: "Mar 3, 2026",
  },
];

// ─── Forum List ───────────────────────────────────────────────────────────────
const ForumList = () => {
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

  const posts = DEMO_POSTS.filter((p) => p.forum_id === selectedForum?._id);
  const comments = DEMO_COMMENTS.filter(
    (c) => c.post_id === selectedPost?._id
  );

  // ── Post detail view ──
  if (selectedPost) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => setSelectedPost(null)}
          className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
        >
          ← Back to posts
        </button>

        {/* Post */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-zinc-900">{selectedPost.title}</h2>
          <div className="mt-1 flex gap-3 text-xs text-zinc-400">
            <span>{selectedPost.author}</span>
            <span>{selectedPost.created_at}</span>
          </div>
          <p className="mt-3 text-sm text-zinc-700 leading-relaxed">
            {selectedPost.content}
          </p>
        </div>

        {/* Comments */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-800">
            {comments.length} Comments
          </h3>
          {comments.map((c) => (
            <CommentItem key={c._id} comment={c} />
          ))}
        </div>

        {/* Add comment */}
        <div className="flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment…"
            rows={2}
            className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 resize-none"
          />
          <button
            disabled={!newComment.trim()}
            className="self-end rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Post
          </button>
        </div>
      </div>
    );
  }

  // ── Forum posts view ──
  if (selectedForum) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => setSelectedForum(null)}
          className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
        >
          ← Back to forums
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900">{selectedForum.title}</h1>
          <button className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors">
            <BiPlus className="h-4 w-4" />
            New Post
          </button>
        </div>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16">
              <BiMessageDetail className="h-10 w-10 text-zinc-300" />
              <p className="mt-3 text-sm text-zinc-500">No posts yet. Be the first!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  // ── Forum list view ──
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Forums</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Discuss, ask questions, and support each other
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {DEMO_FORUMS.map((forum) => (
          <ForumCard
            key={forum._id}
            forum={forum}
            onClick={() => setSelectedForum(forum)}
          />
        ))}
      </div>
    </div>
  );
};

export default ForumList;

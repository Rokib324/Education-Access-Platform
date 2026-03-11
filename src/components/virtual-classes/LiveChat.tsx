"use client";

import { useState, useEffect, useRef } from "react";
import { BiSend, BiUser } from "react-icons/bi";

type Message = {
  _id: string;
  sender_id: { full_name: string; _id: string };
  message_text: string;
  sent_at: string;
};

export default function LiveChat({ classId, currentUserId }: { classId: string, currentUserId?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/virtual-classes/${classId}/messages`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages?.length > messages.length) {
            setMessages(data.messages);
            scrollToBottom();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [classId]);

  const scrollToBottom = () => {
    setTimeout(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/virtual-classes/${classId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_text: input })
      });
      if (res.ok) {
        setInput("");
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950">
        <h3 className="font-semibold text-white">Live Chat</h3>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
            No messages yet. Be the first to say hi!
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_id._id === currentUserId;
            return (
              <div key={msg._id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && <span className="text-[10px] text-zinc-500 ml-1 mb-0.5">{msg.sender_id.full_name}</span>}
                <div 
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    isMe 
                      ? "bg-blue-600 text-white rounded-br-sm" 
                      : "bg-zinc-800 text-zinc-200 rounded-bl-sm"
                  }`}
                >
                  {msg.message_text}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-zinc-800 bg-zinc-950">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 pr-10"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            <BiSend className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
